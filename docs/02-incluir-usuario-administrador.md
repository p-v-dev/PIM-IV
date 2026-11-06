# 2. Incluir usuario - Administrador

**Atores:** administrador.

**Precondicao:** administrador autenticado, com a tela principal aberta.

## Estado e escopo

**Status:** implementado no Desktop e na API. Analise estatica do codigo em
28/10/2026; nao houve execucao do aplicativo.

**O que tem:** botao Novo; formulario com nome, e-mail, senha e selecao de papel
`admin`, `teacher` ou `student` (padrao); envio real a `POST /users`; acesso
restrito ao administrador; validacao de e-mail, senha de no minimo 8 caracteres
e papel permitido; rejeicao de e-mail duplicado; hash de senha; persistencia
com `isActive = true`; atualizacao da lista apos salvar.

**O que falta:** nenhuma funcionalidade para o caso de uso informado.

**Como fazer:** manter `MainForm`, `UserForm`, `AdminApiClient`, `AuthController`,
`AuthService` e `UsersService` como estao. Nao criar outro cadastro, endpoint ou
servico. Os diagramas abaixo representam a implementacao existente.

**Verificacao de aceite:** cadastrar um usuario de cada papel e conferir a lista;
tentar e-mail repetido, e-mail invalido e senha curta; confirmar que aluno e
professor nao conseguem cadastrar pela API.

## UML do estado atual

Somente classes do projeto e o caminho feliz. Login, autorizacao, estilizacao
e detalhes da atualizacao da lista ficam fora do fluxo.

## Diagrama de classes

`DesktopUser` e `BackendUser` identificam as classes `User` de cada aplicacao.
Sao tipos distintos, sem heranca entre eles.

```mermaid
classDiagram
    namespace Desktop {
        class MainForm {
            -AdminApiClient apiClient
            -UserSession session
            -CreateUser() void
            -LoadUsersAsync() Task
        }
        class UserForm {
            -AdminApiClient apiClient
            -UserSession session
            +CreateRequest() CreateUserRequest
            -SaveButton_Click(sender, e) void
        }
        class UserSession {
            +string AccessToken
        }
        class CreateUserRequest {
            <<record>>
            +string Name
            +string Email
            +string Password
            +string Role
        }
        class AdminApiClient {
            +CreateUserAsync(request) Task~DesktopUser~
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
            +createUser(dto)
        }
        class CreateUserDto {
            +string name
            +string email
            +string password
            +UserRole role
        }
        class AuthService {
            -UsersService usersService
            +createUser(name, email, password, role)
            -hashPassword(password)
            -publicUser(user)
        }
        class UsersService {
            +findByEmail(email)
            +create(user)
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
    MainForm ..> UserForm : cria
    UserForm --> AdminApiClient : apiClient
    UserForm --> UserSession : session
    UserForm ..> CreateUserRequest : cria
    AdminApiClient ..> CreateUserRequest : recebe
    AdminApiClient ..> DesktopUser : desserializa e retorna
    AdminApiClient ..> AuthController : HTTP POST /users
    AuthController --> AuthService : authService
    AuthController ..> CreateUserDto : recebe
    AuthService --> UsersService : usersService
    AuthService ..> BackendUser : prepara os dados
    UsersService ..> BackendUser : consulta e persiste
```

## Diagrama de sequencia

Frontend a esquerda e backend a direita. Objetos de requisicao e usuarios
aparecem nos dados das mensagens. O cliente envia o token da sessao existente.

```mermaid
sequenceDiagram
    actor Admin as Administrador
    box Frontend - Desktop
        participant Principal as MainForm
        participant Formulario as UserForm
        participant Api as AdminApiClient
    end
    box Backend
        participant Controller as AuthController
        participant Auth as AuthService
        participant Users as UsersService
    end

    Admin->>Principal: Clica em Novo
    Principal->>Principal: CreateUser()
    Principal->>Formulario: new UserForm(apiClient, session)
    Principal->>Formulario: ShowDialog(this)
    Admin->>Formulario: Preenche os dados e clica em Salvar
    Formulario->>Formulario: Valida campos e chama CreateRequest()
    Formulario->>Api: CreateUserAsync(request)
    Api->>Controller: POST /users com dados e token
    Controller->>Auth: createUser(name, email, password, role)
    Auth->>Users: findByEmail(email)
    Users-->>Auth: null (e-mail disponivel)
    Auth->>Auth: hashPassword(password)
    Note over Auth: Gera ID e define isActive = true
    Auth->>Users: create(user)
    Note over Users: Salva a entidade User no banco
    Users-->>Auth: BackendUser criado
    Auth->>Auth: publicUser(user) remove passwordHash
    Auth-->>Controller: Dados publicos do usuario
    Controller-->>Api: HTTP 201 com usuario criado
    Api-->>Formulario: DesktopUser
    Formulario->>Formulario: Define DialogResult.OK e fecha
    Formulario-->>Principal: ShowDialog retorna OK
    Principal->>Principal: LoadUsersAsync() atualiza a lista
```

**Fontes:** `MainForm.cs`, `UserForm.cs`, `Models/CreateUserRequest.cs`,
`Models/User.cs` e `Networking/AdminApiClient.cs` no Desktop;
`auth/auth.controller.ts`, `auth/dto/create-user.dto.ts`, `auth/auth.service.ts`,
`users/users.service.ts` e `users/user.entity.ts` no backend.
