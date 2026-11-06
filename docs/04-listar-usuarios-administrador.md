# 4. Listar usuarios - Administrador

**Atores:** administrador.

**Precondicao:** administrador autenticado.

## Estado e escopo

**Status:** implementado no Desktop e na API. Este arquivo foi mantido porque
ja faz parte da documentacao e apoia inclusao, edicao e desativacao.
Analise estatica do codigo em 28/10/2026; nao houve execucao do aplicativo.

**O que tem:** carregamento ao abrir a tela principal ou clicar em Atualizar;
`GET /users` restrito ao administrador; consulta real ao banco, sem retornar
hash de senha; tabela com nome, e-mail, papel e status de ativos e inativos.

**O que falta:** nenhuma funcionalidade para a listagem simples existente.

**Como fazer:** manter a consulta e a tabela atuais. Busca, filtros e paginacao
nao sao necessarios para os casos discutidos; nao adiciona-los por antecipacao.
Os diagramas abaixo representam a implementacao existente.

**Verificacao de aceite:** conferir usuarios ativos e inativos; atualizar apos
uma alteracao; confirmar bloqueio da API para perfis diferentes de admin.

## UML do estado atual

Somente classes do projeto e o caminho feliz. A lista e carregada ao abrir a
tela principal ou clicar em Atualizar. A sequencia considera o clique em
Atualizar, sem detalhar login, autorizacao ou fluxos de erro.

## Diagrama de classes

`DesktopUser` e `BackendUser` identificam as classes `User` de cada aplicacao.
Sao tipos distintos, sem heranca entre eles. Componentes visuais e classes de
bibliotecas nao sao representados.

```mermaid
classDiagram
    namespace Desktop {
        class MainForm {
            -AdminApiClient apiClient
            -UserSession session
            -LoadUsersAsync() Task
        }
        class UserSession {
            +string AccessToken
        }
        class AdminApiClient {
            +GetUsersAsync()
        }
        class DesktopUser {
            <<record>>
            +string Id
            +string Name
            +string Email
            +string Role
            +bool IsActive
        }
    }
    namespace Backend {
        class AuthController {
            -AuthService authService
            +listUsers()
        }
        class AuthService {
            -UsersService usersService
            +listUsers()
            -publicUser(user)
        }
        class UsersService {
            +findAll()
        }
        class BackendUser {
            +string id
            +string name
            +string email
            +string passwordHash
            +UserRole role
            +boolean isActive
        }
    }

    MainForm --> AdminApiClient : apiClient
    MainForm --> UserSession : session
    MainForm ..> DesktopUser : exibe na tabela
    AdminApiClient ..> DesktopUser : desserializa e retorna lista
    AdminApiClient ..> AuthController : HTTP GET /users
    AuthController --> AuthService : authService
    AuthService --> UsersService : usersService
    AuthService ..> BackendUser : remove passwordHash da resposta
    UsersService ..> BackendUser : consulta
```

## Diagrama de sequencia

Frontend a esquerda e backend a direita. Os usuarios aparecem nos dados das
mensagens, sem linhas de vida proprias. O cliente envia o token da sessao
existente.

```mermaid
sequenceDiagram
    actor Admin as Administrador
    box Frontend - Desktop
        participant Principal as MainForm
        participant Api as AdminApiClient
    end
    box Backend
        participant Controller as AuthController
        participant Auth as AuthService
        participant Users as UsersService
    end

    Admin->>Principal: Clica em Atualizar
    Principal->>Principal: LoadUsersAsync()
    Principal->>Api: GetUsersAsync()
    Api->>Controller: GET /users com token
    Controller->>Auth: listUsers()
    Auth->>Users: findAll()
    Note over Users: Consulta os usuarios no banco
    Users-->>Auth: Lista de BackendUser
    Auth->>Auth: publicUser(user) para cada usuario
    Note over Auth: Remove passwordHash da resposta
    Auth-->>Controller: Lista de dados publicos dos usuarios
    Controller-->>Api: HTTP 200 com lista de usuarios
    Api-->>Principal: Lista de DesktopUser
    Principal->>Principal: Atualiza userSource.DataSource
    Note over Principal: Tabela exibe nome, e-mail, papel e status
```

**Regra atual:** a consulta retorna usuarios ativos e inativos, sem filtro ou
paginacao. A tabela apresenta o status como Ativo ou Inativo.

**Fontes:** `MainForm.cs`, `Models/User.cs`, `Session/UserSession.cs` e
`Networking/AdminApiClient.cs` no Desktop;
`auth/auth.controller.ts`, `auth/auth.service.ts`, `users/users.service.ts`
e `users/user.entity.ts` no backend.
