# 3. Editar usuario

**Ator:** administrador.

**Precondicao:** administrador autenticado, com a lista de usuarios carregada.

## Estado e escopo

**Status:** implementado para nome, e-mail e senha. Analise estatica do codigo
em 28/10/2026; nao houve execucao do aplicativo.

**O que tem:** selecao do usuario na tabela, botao Editar, formulario preenchido,
senha opcional, `PATCH /users/:id` restrito ao administrador, validacao de dados,
verificacao de e-mail ja usado por outro usuario, hash da nova senha e
atualizacao da lista. Senha vazia mantem a senha anterior.

**O que falta:** nada para editar os campos descritos. Alterar papel nao existe:
o formulario o mostra somente para leitura e `UpdateUserRequest` e
`UpdateUserDto` nao possuem esse campo.

**Como fazer:** manter a implementacao atual. Selecionar papel na inclusao nao
implica obrigatoriamente permitir troca na edicao. A troca de papel so deve
entrar no escopo se for exigida pelo trabalho; nesse caso, ajustar o mesmo
`UserForm`, os dois contratos de atualizacao e `AuthService.updateUser`, com
validacao dos tres papeis, sem criar outra tela ou endpoint. Essa extensao e
condicional, nao uma pendencia obrigatoria deste caso.

**Verificacao de aceite:** editar nome/e-mail; salvar sem nova senha e conferir
que a anterior funciona; definir nova senha de pelo menos 8 caracteres e
conferir o login; rejeitar e-mail de outro usuario e edicao por nao administrador.

## UML do estado atual

Somente classes do projeto e o caminho feliz. O papel nao pode ser alterado.
A senha e opcional: se ficar vazia, a atual e mantida. A sequencia considera
uma nova senha preenchida, sem detalhar login, autorizacao ou fluxos de erro.

## Diagrama de classes

`DesktopUser` e `BackendUser` representam as classes `User` de cada aplicacao.

```mermaid
classDiagram
    namespace Desktop {
        class MainForm {
            -AdminApiClient apiClient
            -UserSession session
            -EditUser() void
            -LoadUsersAsync() Task
        }
        class UserForm {
            -AdminApiClient apiClient
            -UserSession session
            -DesktopUser user
            +bool IsEditMode
            +UpdateRequest() UpdateUserRequest
            -SaveButton_Click(sender, e) void
        }
        class UserSession {
            +string AccessToken
        }
        class UpdateUserRequest {
            <<record>>
            +string Name
            +string Email
            +string Password
        }
        class AdminApiClient {
            +UpdateUserAsync(id, request) Task~DesktopUser~
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
            +updateUser(id, dto)
        }
        class UpdateUserDto {
            +string name
            +string email
            +string password
        }
        class AuthService {
            -UsersService usersService
            +updateUser(id, data)
            -hashPassword(password)
            -publicUser(user)
        }
        class UsersService {
            +findByEmail(email)
            +findById(id)
            +update(id, user)
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
    MainForm ..> UserForm : cria em modo de edicao
    MainForm ..> DesktopUser : seleciona
    UserForm --> AdminApiClient : apiClient
    UserForm --> UserSession : session
    UserForm --> "0..1" DesktopUser : user
    UserForm ..> UpdateUserRequest : cria
    AdminApiClient ..> UpdateUserRequest : recebe
    AdminApiClient ..> DesktopUser : desserializa e retorna
    AdminApiClient ..> AuthController : HTTP PATCH /users/id
    AuthController --> AuthService : authService
    AuthController ..> UpdateUserDto : recebe
    AuthService --> UsersService : usersService
    AuthService ..> BackendUser : prepara os dados
    UsersService ..> BackendUser : consulta e atualiza
```

## Diagrama de sequencia

Frontend a esquerda e backend a direita. Objetos de requisicao e usuarios
aparecem nos dados das mensagens, sem linhas de vida proprias.

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

    Admin->>Principal: Seleciona usuario e clica em Editar
    Principal->>Principal: EditUser()
    Principal->>Formulario: new UserForm(apiClient, session, user)
    Note over Formulario: Preenche nome e e-mail atuais, papel somente leitura
    Principal->>Formulario: ShowDialog(this)
    Admin->>Formulario: Altera nome, e-mail e senha e clica em Salvar
    Formulario->>Formulario: Valida campos e chama UpdateRequest()
    Formulario->>Api: UpdateUserAsync(user.Id, request)
    Api->>Controller: PATCH /users/{id} com dados e token
    Controller->>Auth: updateUser(id, dto)
    Auth->>Users: findByEmail(data.email)
    Users-->>Auth: null ou usuario com o mesmo id (sem conflito)
    Auth->>Auth: hashPassword(data.password)
    Auth->>Users: update(id, dados atualizados)
    Users->>Users: findById(id)
    Note over Users: Salva os dados alterados na entidade existente
    Users-->>Auth: BackendUser atualizado
    Auth->>Auth: publicUser(user) remove passwordHash
    Auth-->>Controller: Dados publicos do usuario
    Controller-->>Api: HTTP 200 com usuario atualizado
    Api-->>Formulario: DesktopUser
    Formulario->>Formulario: Define DialogResult.OK e fecha
    Formulario-->>Principal: ShowDialog retorna OK
    Principal->>Principal: LoadUsersAsync() atualiza a lista
```

**Fontes:** `MainForm.cs`, `UserForm.cs`, `Models/UpdateUserRequest.cs`,
`Models/User.cs` e `Networking/AdminApiClient.cs` no Desktop;
`auth/auth.controller.ts`, `auth/dto/update-user.dto.ts`, `auth/auth.service.ts`,
`users/users.service.ts` e `users/user.entity.ts` no backend.
