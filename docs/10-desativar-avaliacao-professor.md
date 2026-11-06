# 10. Desativar avaliacao - Professor

**Atores:** professor (`teacher`). **Frontend:** somente web.

**Precondicao do fluxo real:** professor autenticado e ativo, selecionando uma
avaliacao de sua autoria.

## Estado atual

Implementado na web e API. Validado por testes unitarios, lint e build em
06/11/2026.

| Parte | Status | O que tem |
| --- | --- | --- |
| Web | Implementado | Professor confirma a desativacao, recebe o estado persistido e o cartao passa a exibir Inativa sem ser removido. |
| API | Implementado | `Exam.isActive` inicia como verdadeiro e `PATCH /exams/:id/deactivate` desativa somente uma avaliacao do professor autenticado. |

Avaliacoes inativas nao aparecem na lista do aluno, nao entregam conteudo e
rejeitam novas tentativas. Avaliacoes e tentativas nao sao excluidas: o professor
continua vendo a avaliacao inativa e seus resultados, e o aluno preserva o
historico ja salvo.

Em desenvolvimento, o TypeORM cria a coluna `isActive` por `synchronize`.
Em banco de producao, aplicar uma migration com valor padrao `true` antes de
publicar esta versao.

## Planejamento original (historico)

O registro abaixo descreve a tela e a API antes da integracao.

## O que precisa fazer

1. Reutilizar autenticacao e lista propria do [caso 8](08-criar-avaliacao-professor.md).
2. Guardar disponibilidade ativa/inativa em `Exam` e oferecer uma operacao
   exclusiva do professor proprietario, sem excluir avaliacao nem tentativas.
3. Trocar Excluir por Desativar na interface, manter confirmacao e mostrar o
   status real apos sucesso.
4. Bloquear avaliacoes inativas na listagem, consulta de conteudo e envio do
   aluno. Ocultar somente o cartao no navegador nao e protecao suficiente.
5. Preservar consultas de tentativas e historico, inclusive de inativas.

## Como fazer com o minimo de alteracao

### API e banco

Adicionar somente `Exam.isActive`, booleano com padrao `true`. Avaliacoes novas
e registros existentes devem iniciar ativos. Esse caso exige uma coluna nova,
nao uma tabela. Atualizar o esquema conforme a configuracao do projeto:
`app.module.ts` usa `synchronize` apenas em desenvolvimento. Fora dele, aplicar
a alteracao de esquema com valor padrao e preenchimento dos registros existentes
antes de usar o novo campo; nao habilitar sincronizacao destrutiva por conveniencia.

**Adicionar (proposta):** `PATCH /exams/:id/deactivate` em `ExamController`, com
guards e `@Roles('teacher')`, chamando `ExamService.deactivate(teacherId, id)`.
Buscar por `{ id, teacherId: request.user.id }`; ausente ou de outro professor
retorna 404. Atualizar somente `isActive = false` e devolver a avaliacao.
Repetir a operacao deve manter o estado inativo sem erro de duplicidade.

Nao receber `teacherId` do corpo, nao excluir `Exam`/`Attempt` e nao alterar o
prazo para simular desativacao: prazo e disponibilidade sao conceitos distintos.

Alterar os pontos existentes e propostos de acesso do aluno:

| Ponto | Ajuste necessario |
| --- | --- |
| `ExamService.findFuture` existente (`GET /exams`) | Exigir prazo futuro e `isActive = true`. |
| `ExamService.findForStudent` proposto no caso 6 | Rejeitar avaliacao inativa, alem de inexistente ou vencida; continuar sem expor gabarito. |
| `AttemptService.submit` existente | Rejeitar avaliacao inativa na validacao do servidor, mesmo se a tela tiver sido aberta antes. |
| `findByTeacher` proposto no caso 8 | Incluir ativas e inativas na lista do proprietario. |
| Consultas propostas nos casos 7 e 9 | Nao filtrar `isActive`; resultados continuam consultaveis. |

A verificacao de disponibilidade vale no momento da validacao do envio. Uma
tentativa que ja passou dessa validacao pode terminar enquanto ocorre a
desativacao; esta proposta nao promete cancelar requisicoes em andamento. Se
o trabalho exigir bloqueio atomico entre envio e desativacao, serializar ambas
as operacoes sobre a mesma avaliacao em transacao no banco, nao com lock global
em memoria. Essa garantia adicional nao e necessaria para o fluxo sequencial
de demonstracao aqui descrito.

### Web

Reutilizar `Professor.jsx`, `EvaluationCard` e o modal existente, trocando nomes
e mensagens de exclusao para desativacao. Acrescentar
`desativarAvaliacao(id, token)` ao `examService.js`; o proxy `/exams` ja cobre
a rota proposta. Usar a resposta real para atualizar o item, sem remove-lo da
lista. Mostrar Inativa, desabilitar Desativar e manter acesso a Ver resultados.

Durante o envio, bloquear nova confirmacao. Em falha, preservar o item e
informar erro; cancelar o modal nao faz chamada nem altera o estado. Nao criar
nova pagina, reativacao, exclusao permanente ou tabela de arquivamento.

## UML do estado atual

`Professor` e `examService` sao representacoes logicas do frontend.
`<<boundary>>` representa uma interface React; `<<control>>`, a logica web que
coordena as chamadas a API.

```mermaid
classDiagram
    class Professor {
        <<boundary>>
        abrirDesativacao(avaliacao)
        confirmarDesativacao()
    }
    class EvaluationCard {
        <<boundary>>
        onDeactivate(avaliacao)
    }
    class examService {
        <<control>>
        desativarAvaliacao(id, token)
    }
    class ExamController {
        deactivate(request, id)
    }
    class ExamService {
        deactivate(teacherId, id)
        findFuture()
        findForStudent(id)
    }
    class Exam {
        id
        teacherId
        deadline
        isActive
    }
    class AttemptService {
        submit(studentId, examId, answers)
    }
    Professor ..> EvaluationCard : exibe estado real
    Professor ..> examService : confirma desativacao
    examService ..> ExamController : PATCH /exams/id/deactivate
    ExamController --> ExamService
    ExamService ..> Exam : consulta propriedade e atualiza status
    AttemptService ..> Exam : valida isActive
```

## Diagrama de sequencia

```mermaid
sequenceDiagram
    actor Professor
    participant Tela as Professor.jsx
    participant Controle as examService
    participant Controller as ExamController
    participant Service as ExamService
    participant Banco as Banco existente
    Professor->>Tela: Clica em Desativar
    Tela-->>Professor: Solicita confirmacao
    Professor->>Tela: Confirma
    Tela->>Controle: desativarAvaliacao(id)
    Controle->>Controller: PATCH /exams/:id/deactivate com token
    Note over Controller: Guards exigem sessao ativa e papel teacher
    Controller->>Service: deactivate(request.user.id, id)
    Service->>Banco: Busca por id e teacherId
    Banco-->>Service: Avaliacao ou ausente
    alt Avaliacao propria
        Service->>Banco: Salva isActive = false
        Banco-->>Service: Avaliacao inativa
        Service-->>Controller: Avaliacao atualizada
        Controller-->>Controle: HTTP 200 com avaliacao
        Controle-->>Tela: Avaliacao atualizada
        Tela-->>Professor: Marca Inativa e mantem resultados acessiveis
        Note over Banco: Exam e Attempt permanecem no banco
    else Avaliacao inexistente ou de outro professor
        Service-->>Controller: Nao encontrada
        Controller-->>Controle: HTTP 404
        Controle-->>Tela: Erro de indisponibilidade
        Tela-->>Professor: Informa erro sem alterar a lista
    end
```

## Verificacao de aceite

- Cancelar nao muda o registro; confirmar persiste Inativa, inclusive ao
  recarregar. Repetir a chamada continua seguro e preserva os resultados.
- Professor nao desativa avaliacao de outro, mesmo alterando o ID na API;
  aluno e usuario sem sessao nao conseguem executar a operacao.
- Depois de desativada, avaliacao nao aparece na lista disponivel ao aluno;
  consulta direta de conteudo e novo envio de respostas sao rejeitados.
- Aluno que abriu a tela antes, mas envia apos a desativacao confirmada, recebe
  erro; tentativas salvas antes continuam no historico e na consulta do professor.
- Erro de rede nao remove a avaliacao localmente nem exibe falso sucesso.

## Fontes

- `apps/web/src/pages/Professor.jsx:227-236`, `518-525`
- `apps/web/src/components/EvaluationCard.jsx:74-80`
- `apps/server/src/exam/exam.entity.ts`, `exam.controller.ts`, `exam.service.ts:33-35`
- `apps/server/src/attempt/attempt.service.ts:14-24`, `attempt.entity.ts`
- `apps/server/src/app.module.ts:13-22`
- [Fazer avaliacao](06-fazer-avaliacao-aluno.md), [Consultar avaliacoes realizadas](07-consultar-avaliacoes-realizadas-aluno.md)
