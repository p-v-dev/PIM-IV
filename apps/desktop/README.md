# EduQuest Admin Desktop

Aplicação administrativa para Windows, construída com C#/.NET 10 e Windows Forms. O cliente consome a API do EduQuest por HTTP e não acessa o SQL Server diretamente.

## Funcionalidades implementadas

- Login administrativo com e-mail e senha.
- Armazenamento do JWT somente em memória durante a sessão.
- Listagem de usuários ao abrir a tela principal e por atualização manual.
- Criação de usuários com nome, e-mail, senha e papel.
- Edição de nome, e-mail e senha sem alteração do papel.
- Desativação de usuários com confirmação.
- Exibição de usuários ativos e inativos.
- Encerramento da sessão quando a API retorna `401` ou `403`.
- URL da API configurável por `EDUQUEST_API_URL` ou `appsettings.json`.

## Requisitos

- Windows.
- .NET 10 SDK.
- API EduQuest em execução.

## Execução

Na pasta `apps/desktop`:

```powershell
dotnet run --project src/EduQuest.Admin.Desktop
```

Ao iniciar, a aplicação usa `EDUQUEST_API_URL` se a variável não estiver vazia, depois a propriedade `ApiUrl` do `appsettings.json` ao lado do executável e, por fim, `http://localhost:3000`. Para definir a URL no PowerShell antes de iniciar:

```powershell
$env:EDUQUEST_API_URL = "https://sua-api.example"
dotnet run --project src/EduQuest.Admin.Desktop
```

Nenhuma credencial é persistida pelo projeto. O token permanece apenas na memória enquanto a aplicação está aberta.

## Instalador Windows x64

Na raiz do repositório, com o SDK .NET 10 e Inno Setup 6.3 ou mais recente (`ISCC.exe` no `PATH`):

```powershell
$publishDir = Join-Path $PWD.Path 'apps\desktop\src\EduQuest.Admin.Desktop\bin\installer-publish'
$outputDir = Join-Path $PWD.Path 'apps\desktop\src\EduQuest.Admin.Desktop\bin\installer-output'
dotnet publish apps/desktop/src/EduQuest.Admin.Desktop -c Release -r win-x64 --self-contained true -o "$publishDir"
ISCC.exe '/DAppVersion=1.2.3' "/DPublishDir=$publishDir" "/DOutputDir=$outputDir" apps/desktop/installer/EduQuest.iss
```

O arquivo `EduQuest-Admin-Windows-x64.exe` fica em `$outputDir`. Ele instala para o usuário atual, sem exigir administrador ou .NET pré-instalado, com atalho no menu Iniciar e atalho opcional na área de trabalho. Para empacotar outra URL padrão, ajuste `ApiUrl` no `appsettings.json` em `$publishDir` antes de chamar `ISCC.exe`.

## Testes automatizados

```powershell
dotnet test
dotnet build
```

Os testes em `tests/EduQuest.Admin.Desktop.Tests` cobrem a leitura da configuração, o cliente HTTP, o envio do token Bearer e o tratamento de erros de sessão.

## Verificação manual

Com a API disponível em `http://localhost:3000`:

1. Execute a aplicação.
2. Confirme que e-mail ou senha vazios são rejeitados sem requisição.
3. Confirme que credenciais inválidas exibem o erro da API e mantêm a tela aberta.
4. Confirme que credenciais administrativas válidas abrem a tela principal.
5. Confirme que os usuários são carregados e podem ser atualizados.
6. Crie um usuário e confirme que ele aparece na lista.
7. Edite nome, e-mail e senha e confirme que o papel permanece inalterado.
8. Desative um usuário e confirme que ele continua visível como `Inativo`.
9. Com uma sessão inválida ou expirada, confirme o retorno à tela de login.

## Estrutura

```text
src/EduQuest.Admin.Desktop/
  Configuration/  leitura da URL da API
  Models/         modelos de usuários e respostas
  Networking/     cliente HTTP administrativo
  Session/        sessão JWT em memória
  *Form.cs        telas de login, usuários e formulário principal
tests/
  EduQuest.Admin.Desktop.Tests/  testes MSTest
```

## Limites atuais

A aplicação é um cliente administrativo para as rotas de autenticação e usuários já disponíveis na API. A validação contra uma API Azure e os testes manuais completos de integração ainda estão pendentes.

Para baixar ou publicar uma versão Windows, veja [Distribuição do EduQuest](../../docs/distribuicao.md).
