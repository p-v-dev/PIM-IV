# 11. Consultar leaderboard - Aluno e professor

**Atores:** aluno (`student`) e professor (`teacher`). **Frontend:** web.

## Estado atual

| Parte | Status | Implementacao |
| --- | --- | --- |
| API | Implementado | `GET /leaderboard` exige sessao ativa de aluno ou professor e retorna os 20 alunos ativos com maior pontuacao. |
| Web do aluno | Implementado | `Leaderboard` consulta a API e trata carregamento, lista vazia, erro e sessao nao autorizada. |
| Web do professor | Implementado | A aba Leaderboard consulta a mesma API e trata carregamento, lista vazia, erro e sessao nao autorizada. |

O ranking e ordenado por pontos decrescentes, nome crescente e ID crescente.
Retorna apenas `studentId`, `name` e `points`; nao expoe e-mail, senha, tentativas
ou gabarito. A pontuacao e acumulada quando o aluno envia uma tentativa valida.

## UML do estado atual

`<<boundary>>` representa uma interface React; `<<control>>`, o modulo web que
coordena a chamada autenticada a API.

```mermaid
classDiagram
    class StudentHome {
        <<boundary>>
    }
    class Leaderboard {
        <<boundary>>
    }
    class Professor {
        <<boundary>>
    }
    class examService {
        <<control>>
        buscarLeaderboard(token)
    }
    class LeaderboardController {
        +findAll()
    }
    class AttemptService {
        +getLeaderboard()
    }
    class User {
        id
        name
        role
        isActive
        points
    }

    StudentHome --> Leaderboard : exibe
    Leaderboard --> examService : consulta ranking
    Professor --> examService : consulta ranking
    examService ..> LeaderboardController : GET /leaderboard
    LeaderboardController --> AttemptService
    AttemptService ..> User : consulta alunos ativos
```

## Diagrama de sequencia

```mermaid
sequenceDiagram
    actor Usuario as Aluno ou professor
    participant Tela as Leaderboard ou Professor
    participant Controle as examService
    participant Controller as LeaderboardController
    participant Service as AttemptService
    participant Users as Repositorio User

    Usuario->>Tela: Solicita leaderboard
    Tela->>Controle: buscarLeaderboard()
    Controle->>Controller: GET /leaderboard com JWT
    Note over Controller: JwtAuthGuard e RolesGuard aceitam student ou teacher
    Controller->>Service: getLeaderboard()
    Service->>Users: Busca alunos ativos, ordena e limita 20
    Users-->>Service: studentId, name, points
    Service-->>Controller: Ranking resumido
    Controller-->>Controle: HTTP 200
    Controle-->>Tela: Ranking resumido
    Tela-->>Usuario: Exibe ranking
```

## Fontes

- `apps/server/src/attempt/attempt.controller.ts`
- `apps/server/src/attempt/attempt.service.ts`
- `apps/web/src/components/student/Leaderboard.jsx`
- `apps/web/src/pages/student/StudentHome.jsx`
- `apps/web/src/pages/Professor.jsx`
