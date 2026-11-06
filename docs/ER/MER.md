# MER - EduQuest

Modelo conceitual do estado atual. `admin`, `teacher` e `student` sao papeis
da entidade `USUARIO`, nao entidades separadas.

```mermaid
erDiagram
    USUARIO ||--o{ AVALIACAO : "cria como professor"
    USUARIO ||--o{ TENTATIVA : "realiza como aluno"
    AVALIACAO ||--o{ TENTATIVA : "recebe"
    AVALIACAO }o--o{ QUESTAO : "seleciona"

    USUARIO {
        UUID id PK
        string nome
        string email UK
        string senha_hash
        string papel
        boolean ativo
        int pontos
    }

    QUESTAO {
        UUID id PK
        string enunciado UK
        string_array alternativas
        int indice_alternativa_correta
    }

    AVALIACAO {
        UUID id PK
        UUID professor_id
        string titulo
        string descricao
        datetime prazo
        boolean ativa
        datetime criada_em
    }

    TENTATIVA {
        UUID id PK
        UUID aluno_id
        UUID avaliacao_id
        answer_array respostas
        int acertos
        int total_questoes
        datetime criada_em
    }
```

## Regras do dominio

- Um usuario professor pode criar nenhuma ou varias avaliacoes.
- Um usuario aluno pode realizar nenhuma ou varias tentativas.
- Uma avaliacao pode receber varias tentativas, uma por aluno.
- A combinacao `aluno_id + avaliacao_id` e unica.
- Uma avaliacao seleciona uma ou mais questoes; uma questao pode compor varias
  avaliacoes.
- Avaliacao inativa preserva tentativas e deixa de estar disponivel para novos
  alunos.

## Observacao de implementacao

O relacionamento `AVALIACAO`--`QUESTAO` e conceitual. No banco atual, os IDs
das questoes ficam no campo JSON `questionIds` de `exams`; nao existe tabela
associativa. As respostas de uma tentativa tambem ficam no JSON `answers`.
