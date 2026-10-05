# Desktop Task 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the .NET 10 WinForms desktop foundation, MSTest project, configurable API URL, and setup documentation.

**Architecture:** A single WinForms executable project provides the desktop shell. A small `ApiSettings` configuration boundary resolves the API URL from `EDUQUEST_API_URL` with a localhost fallback. A separate MSTest project references the desktop project and verifies URL resolution without external dependencies.

**Tech Stack:** C# .NET 10, WinForms, MSTest, `System.Text.Json`.

## Global Constraints

- Target `net10.0-windows` exactly.
- Set `UseWindowsForms=true` on the desktop project.
- Do not add third-party dependencies.
- Do not include credentials or production URLs.
- Keep JWT, HTTP calls, domain models, and database access out of this task.
- Use `http://localhost:3000` when `EDUQUEST_API_URL` is missing or whitespace.

---

### Task 1: Install the SDK and scaffold the solution

**Files:**
- Create: `apps/desktop/EduQuest.Admin.Desktop.sln`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/EduQuest.Admin.Desktop.csproj`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Program.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.Designer.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.resx`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/appsettings.json`
- Create: `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj`
- Create: `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/ApiSettingsTests.cs`
- Create: `apps/desktop/NuGet.Config`

**Interfaces:**
- Produces a solution containing the desktop and test projects.
- Produces a WinForms entry point calling `ApplicationConfiguration.Initialize()` and `Application.Run(new MainForm())`.

- [ ] **Step 1: Install .NET 10 SDK**

Run the official Windows installer command through `winget`:

```powershell
winget install --id Microsoft.DotNet.SDK.10 --source winget
```

Expected: the .NET 10 SDK installs successfully. Open a new shell if required, then verify:

```powershell
dotnet --list-sdks
```

Expected: at least one `10.0.xxx` SDK is listed.

- [ ] **Step 2: Create the solution and projects**

From `apps/desktop`, run:

```powershell
dotnet new sln -n EduQuest.Admin.Desktop
dotnet new winforms -n EduQuest.Admin.Desktop -o src/EduQuest.Admin.Desktop --framework net10.0
dotnet new mstest -n EduQuest.Admin.Desktop.Tests -o tests/EduQuest.Admin.Desktop.Tests --framework net10.0
dotnet sln EduQuest.Admin.Desktop.sln add src/EduQuest.Admin.Desktop/EduQuest.Admin.Desktop.csproj
dotnet sln EduQuest.Admin.Desktop.sln add tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj
dotnet add tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj reference src/EduQuest.Admin.Desktop/EduQuest.Admin.Desktop.csproj
```

Expected: both projects are added to the solution and the generated project targets the requested frameworks.

- [ ] **Step 3: Set the exact project configuration**

Ensure `src/EduQuest.Admin.Desktop/EduQuest.Admin.Desktop.csproj` contains:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWindowsForms>true</UseWindowsForms>
  </PropertyGroup>

  <ItemGroup>
    <None Update="appsettings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>
</Project>
```

Ensure the test project targets `net10.0-windows` so it can reference the WinForms project, enables nullable and implicit usings, and references the desktop project plus the generated MSTest packages.

- [ ] **Step 4: Verify the scaffold builds**

Run:

```powershell
dotnet build EduQuest.Admin.Desktop.sln
```

Expected: build succeeds with zero errors.

### Task 2: Implement API URL configuration using TDD

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Configuration/ApiSettings.cs`
- Modify: `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/ApiSettingsTests.cs`
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/appsettings.json`

**Interfaces:**
- Produces `ApiSettings.DefaultUrl` with value `http://localhost:3000`.
- Produces `ApiSettings.GetApiUrl()` returning the environment URL or the default, with trailing slashes removed.

- [ ] **Step 1: Write failing tests**

Replace the generated test with:

```csharp
using EduQuest.Admin.Desktop.Configuration;

namespace EduQuest.Admin.Desktop.Tests;

[TestClass]
public class ApiSettingsTests
{
    private const string EnvironmentVariable = "EDUQUEST_API_URL";
    private string? previousValue;

    [TestInitialize]
    public void SaveEnvironment()
    {
        previousValue = Environment.GetEnvironmentVariable(EnvironmentVariable);
    }

    [TestCleanup]
    public void RestoreEnvironment()
    {
        Environment.SetEnvironmentVariable(EnvironmentVariable, previousValue);
    }

    [TestMethod]
    public void UsesLocalhostWhenEnvironmentVariableIsMissing()
    {
        Environment.SetEnvironmentVariable(EnvironmentVariable, null);

        Assert.AreEqual("http://localhost:3000", ApiSettings.GetApiUrl());
    }

    [TestMethod]
    public void UsesConfiguredUrlAndRemovesTrailingSlashes()
    {
        Environment.SetEnvironmentVariable(EnvironmentVariable, "https://api.example.test///");

        Assert.AreEqual("https://api.example.test", ApiSettings.GetApiUrl());
    }

    [TestMethod]
    [DataRow(null)]
    [DataRow("")]
    [DataRow("   ")]
    public void UsesLocalhostWhenEnvironmentVariableIsBlank(string? value)
    {
        Environment.SetEnvironmentVariable(EnvironmentVariable, value);

        Assert.AreEqual("http://localhost:3000", ApiSettings.GetApiUrl());
    }
}
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run:

```powershell
dotnet test tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj --no-restore
```

Expected: FAIL because `ApiSettings` does not exist yet.

- [ ] **Step 3: Implement the minimal configuration boundary**

Create `Configuration/ApiSettings.cs`:

```csharp
namespace EduQuest.Admin.Desktop.Configuration;

public static class ApiSettings
{
    public const string DefaultUrl = "http://localhost:3000";

    public static string GetApiUrl()
    {
        var configuredUrl = Environment.GetEnvironmentVariable("EDUQUEST_API_URL");
        return string.IsNullOrWhiteSpace(configuredUrl)
            ? DefaultUrl
            : configuredUrl.Trim().TrimEnd('/');
    }
}
```

Create `appsettings.json`:

```json
{
  "ApiUrl": "http://localhost:3000"
}
```

- [ ] **Step 4: Run the focused tests and confirm success**

Run:

```powershell
dotnet test tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj
```

Expected: all `ApiSettingsTests` pass.

### Task 3: Add documentation and run the complete verification

**Files:**
- Create: `apps/desktop/README.md`
- Modify: `apps/desktop/ROADMAP.md`

- [ ] **Step 1: Create the README**

Create `apps/desktop/README.md` with:

```markdown
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
```

- [ ] **Step 2: Mark Task 1 complete in the roadmap**

Change only the six unchecked Task 1 items in `ROADMAP.md` to checked after verification succeeds.

- [ ] **Step 3: Run complete tests and build**

From `apps/desktop`, run:

```powershell
dotnet test
dotnet build
```

Expected: both commands succeed with zero errors and all tests pass.

- [ ] **Step 4: Review the final changes**

Run:

```powershell
git status --short
git diff -- apps/desktop
```

Confirm no credentials, production secrets, unrelated files, or generated build output are included.

- [ ] **Step 5: Commit the implementation**

```powershell
git add apps/desktop
git commit -m "feat: scaffold admin desktop app"
```
