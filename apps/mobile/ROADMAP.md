# Roadmap Mobile - Aluno

## Objetivo

Portar 1:1 a area de aluno da web para React Native. O mobile atende somente o
papel `student`; nao tera telas, navegacao ou contratos de professor e
administrador.

O port deve preservar os mesmos casos de uso, regras de autorizacao, contratos
HTTP, estados de tela e modelagem UML da web. A adaptacao visual e apenas para
componentes nativos e tamanho de tela, sem criar comportamento de negocio novo.

## Escopo

| Caso de uso | Ator | Tela web de origem | Tela mobile alvo | Estado |
| --- | --- | --- | --- | --- |
| 1. Fazer login | Aluno | `Login.jsx` | `LoginScreen` | Pendente |
| 6. Fazer avaliacao | Aluno | `StudentEvaluations.jsx`, `StudentExam.jsx` | `StudentEvaluationsScreen`, `StudentExamScreen` | Pendente |
| 7. Consultar avaliacoes realizadas | Aluno | `StudentPerformance.jsx` | `StudentPerformanceScreen` | Pendente |
| 11. Consultar leaderboard | Aluno | `StudentHome.jsx`, `Leaderboard.jsx` | `StudentHomeScreen`, `Leaderboard` | Pendente |

Tambem fazem parte do port visual e de navegacao: `StudentHome`, `StudentFAQ`,
`Navbar`, `WelcomeSection`, `QuickAction`, `LevelCard`, `EvaluationCard` e
`ExitConfirmation`.

Ficam fora do escopo: cadastro publico, professor, administrador, criacao ou
desativacao de avaliacoes, banco de questoes, novas tentativas, cronometro,
rascunho persistente e endpoints novos.

## Modelagem 1:1

As telas React Native assumem o papel `<<boundary>>` da UML web; os modulos de
sessao e API assumem `<<control>>`. O backend e suas entidades nao mudam.

| Web | Mobile | Papel UML |
| --- | --- | --- |
| `Login` | `LoginScreen` | `<<boundary>>` |
| `StudentHome` | `StudentHomeScreen` | `<<boundary>>` |
| `StudentEvaluations` | `StudentEvaluationsScreen` | `<<boundary>>` |
| `StudentExam` | `StudentExamScreen` | `<<boundary>>` |
| `StudentPerformance` | `StudentPerformanceScreen` | `<<boundary>>` |
| `StudentFAQ` | `StudentFaqScreen` | `<<boundary>>` |
| `authService` | `authService` | `<<control>>` |
| `examService` | `examService` | `<<control>>` |

Os diagramas de classe e sequencia de referencia sao:

- [`01-fazer-login-administrador-aluno-professor.md`](../../docs/01-fazer-login-administrador-aluno-professor.md): somente ramificacao do aluno.
- [`06-fazer-avaliacao-aluno.md`](../../docs/06-fazer-avaliacao-aluno.md).
- [`07-consultar-avaliacoes-realizadas-aluno.md`](../../docs/07-consultar-avaliacoes-realizadas-aluno.md).
- [`11-consultar-leaderboard-aluno-professor.md`](../../docs/11-consultar-leaderboard-aluno-professor.md): somente ramificacao do aluno.

## Contratos obrigatorios

O mobile consome a mesma API. Nao replica correcao, pontuacao, autorizacao ou
regras de prazo no aparelho.

| Fluxo | Chamada | Regra preservada |
| --- | --- | --- |
| Sessao | `POST /auth/login`, `GET /auth/me` | Aceita somente perfil `student` ativo. |
| Avaliacoes | `GET /exams`, `GET /exams/:id` | Somente ativas, dentro do prazo e sem gabarito. |
| Envio | `POST /exams/:id/attempts` | Uma tentativa; API corrige e retorna resultado oficial. |
| Historico | `GET /attempts/me` | Somente tentativas do aluno autenticado. |
| Ranking | `GET /leaderboard` | Ate 20 alunos ativos ordenados por pontos. |

O token sera enviado como `Authorization: Bearer <token>`. A URL da API sera
configurada por ambiente; o mobile nao usa o proxy do Vite. Tokens nao devem ser
incluidos em logs, arquivos de configuracao ou repositorio.

## Etapas

### 1. Fundacao mobile

- Manter Expo e React Native atuais.
- Adicionar navegacao nativa com pilhas e abas para aluno.
- Criar tema, componentes de layout e indicadores de carregamento/erro que
  preservem a linguagem visual da web.
- Criar `authService` e `examService` mobile com os contratos acima.
- Implementar guarda de navegacao que permita somente sessao `student` ativa.
- Definir armazenamento de token antes de codificar: manter apenas em memoria
  para equivalencia estrita com a sessao web, ou adotar armazenamento seguro se
  a persistencia entre aberturas for um requisito posterior.

### 2. Caso 1 - Login do aluno

- Criar `LoginScreen` com selecao de Aluno e credenciais.
- Executar login, validar identidade em `/auth/me` e rejeitar `teacher` e
  `admin`.
- Encaminhar aluno autenticado para a home.
- Limpar sessao e voltar ao login em `401` ou `403`.

**Aceite:** credenciais validas de aluno entram; perfil divergente, conta
inativa, token invalido e falha de rede seguem o mesmo comportamento da web.

### 3. Home, navegacao e caso 11 - Leaderboard

- Criar `StudentHomeScreen` com boas-vindas, atalhos, avaliacoes disponiveis e
  `Leaderboard`.
- Criar navegacao para Home, Avaliacoes, Desempenho e FAQ; manter logout com
  confirmacao.
- Consumir `GET /leaderboard`; exibir carregamento, vazio, erro e nova tentativa.
- Remover qualquer dado demonstrativo de ranking.

**Aceite:** aluno ve ranking real, ordenado e sem dados privados; erro de sessao
encerra o acesso.

### 4. Caso 6 - Fazer avaliacao

- Criar listagem de avaliacoes com `GET /exams`.
- Criar tela de prova com `GET /exams/:id`, sem gabarito.
- Preservar respostas enquanto o aluno navega entre questoes.
- Exigir todas as respostas antes do envio.
- Enviar somente `answers` para `POST /exams/:id/attempts`.
- Mostrar `score`, `totalQuestions` e `pointsEarned` retornados pelo servidor.

**Aceite:** nao ha correcao local; prazo vencido, tentativa repetida, resposta
invalida, falha de rede e sessao invalida recebem o mesmo tratamento da web.

### 5. Caso 7 - Consultar avaliacoes realizadas

- Criar `StudentPerformanceScreen` com `GET /attempts/me`.
- Mostrar titulo, data, acertos, nota visual, media e maior nota.
- Calcular apenas a nota visual: `score / totalQuestions * 10`.
- Manter busca local por titulo e estados de carregamento, vazio, erro e retry.

**Aceite:** historico nao mostra dados de outro aluno, permanece disponivel para
avaliacoes vencidas ou inativas e nao exibe gabarito ou respostas.

### 6. FAQ e equivalencia visual

- Portar as perguntas da FAQ e o comportamento expansivel.
- Adaptar componentes para toque, rolagem e leitores de tela.
- Conferir textos, estados vazios, mensagens de erro e fluxos de saida contra a
  web, sem inventar campos ou funcionalidades.

### 7. Testes e validacao integrada

- Testar servicos HTTP com respostas simuladas: token, cabecalho Bearer,
  contratos, `401`, `403`, `404`, `409` e falha de rede.
- Testar navegacao e telas com framework de teste React Native escolhido na
  etapa 1.
- Validar manualmente Android com API e SQL Server reais: login, ranking,
  avaliacao, resultado, historico, logout e sessao expirada.
- Validar em tela pequena e grande antes da entrega.

## Criterio de conclusao

O port e considerado concluido somente quando os quatro casos acima usam dados
reais da API, nao possuem mocks nos fluxos documentados, respeitam as mesmas
guardas de papel e exibem os mesmos resultados de negocio que a web.
