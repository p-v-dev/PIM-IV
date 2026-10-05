# Desktop Admin WinForms Implementation Plan

**Goal:** Criar um aplicativo WinForms .NET 10 para administradores autenticarem e gerenciarem usuários pela API NestJS.

**Architecture:** Um único projeto WinForms consome a API por `HttpClient`. Um cliente centraliza URL, JWT e chamadas; os formulários ficam restritos à interface.

**Tech Stack:** C# .NET 10, WinForms, `HttpClient`, `System.Text.Json`, MSTest.

## Constraints

- Somente rotas administrativas existentes: login e CRUD parcial de usuários.
- Não acessar banco de dados ou Azure diretamente.
- JWT apenas em memória.
- URL da API configurável para localhost e Azure HTTPS.
- Validações simples; a API é a autoridade das regras.

## Files

- Create: `apps/desktop/EduQuest.Admin.Desktop.sln`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/`
- Create: `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/`
- Create: `apps/desktop/README.md`

## Roadmap

### Task 1: Criar solução WinForms

- [x] Criar a solution e o projeto `net10.0-windows` com `UseWindowsForms=true`.
- [x] Criar o projeto MSTest referenciando o projeto desktop.
- [x] Adicionar `ApiSettings`, que lê `EDUQUEST_API_URL`; quando ausente, usa `http://localhost:3000`.
- [x] Criar `appsettings.json` com a URL local como referência, sem credenciais.
- [x] Testar a leitura da URL configurada.
- [x] Executar `dotnet test` e `dotnet build`.

### Task 2: Implementar cliente da API

- [ ] Criar modelos: `LoginResponse`, `User`, `CreateUserRequest` e `UpdateUserRequest`.
- [ ] Criar `AdminApiClient` com:
  - `LoginAsync(email, password)`
  - `GetUsersAsync()`
  - `CreateUserAsync(request)`
  - `UpdateUserAsync(id, request)`
  - `DeactivateUserAsync(id)`
- [ ] Anexar o token em `Authorization: Bearer` nas rotas protegidas.
- [ ] Converter erros HTTP em uma exceção simples com mensagem exibível.
- [ ] Criar testes com `HttpMessageHandler` falso para login, envio do token e erros `401`.
- [ ] Executar `dotnet test`.

### Task 3: Implementar login e sessão

- [ ] Criar `LoginForm` com e-mail, senha, botão entrar e mensagem de erro.
- [ ] Bloquear o envio quando e-mail ou senha estiverem vazios.
- [ ] Armazenar o JWT somente em `UserSession`, em memória.
- [ ] Abrir a tela principal somente após `POST /auth/login` bem-sucedido.
- [ ] Informar erro simples para credenciais inválidas ou API indisponível.
- [ ] Testar manualmente contra `http://localhost:3000`.

### Task 4: Implementar gestão de usuários

- [ ] Criar `MainForm` com `DataGridView` para nome, e-mail, papel e status.
- [ ] Carregar usuários com `GET /users` ao abrir e ao atualizar.
- [ ] Criar `UserForm` para criação com nome, e-mail, senha e papel.
- [ ] Reutilizar `UserForm` para edição de nome, e-mail e senha, sem alterar o papel.
- [ ] Implementar confirmação antes de `PATCH /users/:id/deactivate`.
- [ ] Mostrar usuários inativos na grade.
- [ ] Ao receber `401` ou `403`, encerrar sessão e retornar ao login.
- [ ] Testar manualmente criar, editar, desativar e atualizar lista.

### Task 5: Preparar integração Azure

- [ ] Confirmar que `EDUQUEST_API_URL` aceita a URL HTTPS publicada da API Azure, por exemplo `https://eduquest-api.azurewebsites.net`.
- [ ] Remover URLs de produção fixadas no código.
- [ ] Documentar configuração local e produção no `apps/desktop/README.md`.
- [ ] Publicar para Windows com:
  ```powershell
  dotnet publish src/EduQuest.Admin.Desktop -c Release -r win-x64 --self-contained true
  ```
- [ ] Validar login e gestão de usuários contra a API Azure.
- [ ] Executar `dotnet test` e `dotnet build -c Release`.
