# DER - EduQuest

Modelo fisico derivado das entidades TypeORM atuais em `apps/server/src`.

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
        simple_json options
        int correctOptionIndex
    }

    exams {
        uuid id PK
        uuid teacherId "referencia logica users.id"
        varchar title
        varchar description
        datetime2 deadline
        simple_json questionIds
        boolean isActive "default true"
        datetime2 createdAt
    }

    attempts {
        uuid id PK
        uuid studentId "referencia logica users.id"
        uuid examId "referencia logica exams.id"
        simple_json answers
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

`teacherId`, `studentId` e `examId` sao colunas UUID usadas como referencias
logicas pela aplicacao. As entidades TypeORM nao declaram `@ManyToOne` ou
`@JoinColumn`; portanto, o esquema atual nao cria chaves estrangeiras SQL para
essas colunas. `questionIds` e `answers` sao colunas `simple-json`.
