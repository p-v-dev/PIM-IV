# Task 1: Desktop WinForms Foundation

## Goal

Create the initial EduQuest administrator desktop solution as a .NET 10 WinForms application with a focused MSTest project and environment-based API URL configuration.

## Scope

- Create `apps/desktop/EduQuest.Admin.Desktop.sln`.
- Create the WinForms project at `apps/desktop/src/EduQuest.Admin.Desktop/` targeting `net10.0-windows` with `UseWindowsForms=true`.
- Create the MSTest project at `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/` and reference the desktop project.
- Add `ApiSettings` that reads `EDUQUEST_API_URL` and falls back to `http://localhost:3000`.
- Add `appsettings.json` containing only the local API URL reference.
- Add tests covering the fallback URL, configured URL, and trailing-slash normalization.
- Add `apps/desktop/README.md` with setup and execution instructions.

## Design

The desktop project remains a minimal WinForms shell. `Program.cs` starts the generated main form, while `ApiSettings` is a small static configuration boundary that can be reused by the API client in Task 2. No HTTP client, authentication state, domain models, or database access is introduced yet.

`ApiSettings` resolves the URL in this order:

1. Read `EDUQUEST_API_URL` from the process environment.
2. If it is missing or whitespace, use `http://localhost:3000`.
3. Remove trailing `/` characters so later HTTP route composition is predictable.

The JSON file documents the local default without storing credentials. The initial WinForms project includes the generated form and project defaults only; user workflows are added in later roadmap tasks.

## Testing

MSTest tests call the configuration boundary with controlled environment values. Tests restore the process environment variable after each case so they remain isolated. The solution must pass `dotnet test`, and the desktop project must pass `dotnet build` using the .NET 10 SDK.

## Constraints

- Target .NET 10 exactly as specified by the roadmap.
- Do not add third-party dependencies for configuration or testing.
- Do not include credentials or production URLs.
- The current machine has .NET SDK 8.0.424; install the .NET 10 SDK before local build/test verification.
