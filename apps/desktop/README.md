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

## Verify

```powershell
dotnet test
dotnet build
```
