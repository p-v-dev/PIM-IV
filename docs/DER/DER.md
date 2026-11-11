# DER - EduQuest

Modelo relacional derivado das entidades TypeORM atuais em `apps/server/src`.

```mermaid
erDiagram
    users ||--o{ exams : "teacherId (logico)"
    users ||--o{ attempts : "studentId (logico)"
    exams ||--o{ attempts : "examId (logico)"

    users {
        uuid id PK
        varchar name
        varchar email UK
        varchar passwordHash
        varchar role "default teacher"
        boolean isActive "default true"
        int points "default 0"
    }

    questions {
        uuid id PK
        varchar prompt UK
        json options "simple-json"
        int correctOptionIndex
    }

    exams {
        uuid id PK
        uuid teacherId "referencia logica users.id"
        varchar title
        varchar description
        datetime2 deadline
        json questionIds "simple-json"
        boolean isActive "default true"
        datetime2 createdAt
    }

    attempts {
        uuid id PK
        uuid studentId "UK composta; referencia logica users.id"
        uuid examId "UK composta; referencia logica exams.id"
        json answers "simple-json"
        int score
        int totalQuestions
        datetime2 createdAt
    }
```

## Restricoes fisicas

| Tabela | Restricao |
| --- | --- |
| `users` | PK `id`; UNIQUE `email` |
| `questions` | PK `id`; UNIQUE `prompt` |
| `exams` | PK `id` |
| `attempts` | PK `id`; UNIQUE composto (`studentId`, `examId`) |

A `UNIQUE` de `attempts` e uma unica restricao composta, nao duas restricoes
independentes. Ela permite somente uma tentativa de cada aluno por avaliacao.

## Estrutura de `answers`

`attempts.answers` e JSON, mapeado pela entidade como `simple-json`, contendo
uma lista de objetos no formato `[{ questionId, selectedOptionIndex }]`.
`questionId` identifica a questao respondida e `selectedOptionIndex` identifica
a opcao selecionada para essa mesma questao.

`teacherId`, `studentId` e `examId` sao colunas UUID usadas como referencias
logicas pela aplicacao. As entidades TypeORM nao declaram `@ManyToOne` ou
`@JoinColumn`; portanto, o esquema atual nao cria chaves estrangeiras SQL para
essas colunas. `questionIds` tambem e mapeado como `simple-json`.
