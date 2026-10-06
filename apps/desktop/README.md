# EduQuest Admin Desktop

WinForms desktop application for administrators of the EduQuest API.

## Requirements

- .NET 10 SDK
- Windows

## Run

From this directory:

```powershell
dotnet run --project src/EduQuest.Admin.Desktop
```

The API URL defaults to `http://localhost:3000`. Override it for a session with:

```powershell
$env:EDUQUEST_API_URL = "https://your-api-host"
dotnet run --project src/EduQuest.Admin.Desktop
```

No credentials are stored by this project. Authentication and API operations are added in later roadmap tasks.

## Manual login test

1. Start the API at `http://localhost:3000`.
2. Run the desktop app with `dotnet run --project src/EduQuest.Admin.Desktop`.
3. Confirm empty e-mail or password shows validation without a request.
4. Confirm invalid credentials show the API error and keep the form open.
5. Confirm valid admin credentials open the main window.

## Manual user-management test

After logging in as an administrator:

1. Confirm users load when the main window opens.
2. Use Atualizar and confirm the list reloads.
3. Use Novo to create a user and confirm it appears in the list.
4. Use Editar and confirm name, e-mail, and optional password update; role remains unchanged.
5. Use Desativar, cancel once, then confirm and verify the row remains visible as Inativo.
6. With an expired/invalid session, confirm a `401` or `403` returns to login.

## Verify

```powershell
dotnet test
dotnet build
```
