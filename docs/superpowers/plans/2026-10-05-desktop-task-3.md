# Desktop Task 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the WinForms login flow and in-memory JWT session.

**Architecture:** `Program` composes one `HttpClient`, `UserSession`, `AdminApiClient`, and `LoginForm`. `LoginForm` owns input validation and presentation of API errors, while `UserSession` is the only object storing the JWT. The existing empty `MainForm` opens only after login succeeds.

**Tech Stack:** C# .NET 10, WinForms, `HttpClient`, MSTest.

## Global Constraints

- Target `net10.0-windows` and use existing WinForms/MSTest dependencies.
- Keep the JWT only in memory.
- Do not implement user management controls in `MainForm` yet.
- Do not add persistent configuration for credentials or tokens.
- Use `http://localhost:3000` as the default API URL.

---

### Task 1: Add `UserSession` with tests

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Session/UserSession.cs`
- Create: `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/UserSessionTests.cs`

**Interfaces:**
- Produces `string? AccessToken { get; }`.
- Produces `void SetToken(string token)`.
- Produces `void Clear()`.

- [ ] **Step 1: Write the failing session tests**

Create `UserSessionTests.cs`:

```csharp
using EduQuest.Admin.Desktop.Session;

namespace EduQuest.Admin.Desktop.Tests;

[TestClass]
public class UserSessionTests
{
    [TestMethod]
    public void StoresAndClearsTokenInMemory()
    {
        var session = new UserSession();

        Assert.IsNull(session.AccessToken);

        session.SetToken("jwt-token");
        Assert.AreEqual("jwt-token", session.AccessToken);

        session.Clear();
        Assert.IsNull(session.AccessToken);
    }
}
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```powershell
dotnet test tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj --filter UserSessionTests
```

Expected: FAIL because `UserSession` does not exist.

- [ ] **Step 3: Implement the minimal session**

Create `Session/UserSession.cs`:

```csharp
namespace EduQuest.Admin.Desktop.Session;

public sealed class UserSession
{
    public string? AccessToken { get; private set; }

    public void SetToken(string token)
    {
        AccessToken = token;
    }

    public void Clear()
    {
        AccessToken = null;
    }
}
```

- [ ] **Step 4: Run the focused test and confirm success**

Run the same `dotnet test` command. Expected: 1 test passes.

### Task 2: Create the login form

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/LoginForm.cs`

**Interfaces:**
- Consumes `AdminApiClient`, `UserSession`, and the existing empty `MainForm`.
- Produces a form with email, password, submit, and error controls.

- [ ] **Step 1: Implement the form and login flow**

Create `LoginForm.cs` with code-created controls so this small form does not need designer boilerplate:

```csharp
using EduQuest.Admin.Desktop.Networking;
using EduQuest.Admin.Desktop.Session;

namespace EduQuest.Admin.Desktop;

public sealed class LoginForm : Form
{
    private readonly AdminApiClient apiClient;
    private readonly UserSession session;
    private readonly TextBox emailTextBox = new() { PlaceholderText = "E-mail", Dock = DockStyle.Fill };
    private readonly TextBox passwordTextBox = new() { PlaceholderText = "Senha", UseSystemPasswordChar = true, Dock = DockStyle.Fill };
    private readonly Button loginButton = new() { Text = "Entrar", AutoSize = true, Anchor = AnchorStyles.Right };
    private readonly Label errorLabel = new() { ForeColor = Color.Firebrick, AutoSize = true, Dock = DockStyle.Fill };

    public LoginForm(AdminApiClient apiClient, UserSession session)
    {
        this.apiClient = apiClient;
        this.session = session;
        Text = "EduQuest Admin - Login";
        StartPosition = FormStartPosition.CenterScreen;
        ClientSize = new Size(420, 190);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;

        var layout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(24),
            ColumnCount = 1,
            RowCount = 5,
        };
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.Controls.Add(new Label { Text = "Acesso administrativo", AutoSize = true }, 0, 0);
        layout.Controls.Add(emailTextBox, 0, 1);
        layout.Controls.Add(passwordTextBox, 0, 2);
        layout.Controls.Add(errorLabel, 0, 3);
        layout.Controls.Add(loginButton, 0, 4);
        Controls.Add(layout);

        AcceptButton = loginButton;
        loginButton.Click += LoginButton_Click;
        Shown += (_, _) => emailTextBox.Focus();
    }

    private async void LoginButton_Click(object? sender, EventArgs e)
    {
        errorLabel.Text = string.Empty;
        var email = emailTextBox.Text.Trim();
        var password = passwordTextBox.Text;
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            errorLabel.Text = "Informe e-mail e senha.";
            return;
        }

        loginButton.Enabled = false;
        try
        {
            var response = await apiClient.LoginAsync(email, password);
            session.SetToken(response.AccessToken);
            Hide();
            using var mainForm = new MainForm();
            mainForm.ShowDialog(this);
            Close();
        }
        catch (ApiException exception)
        {
            errorLabel.Text = exception.Message;
            loginButton.Enabled = true;
        }
        catch (HttpRequestException)
        {
            errorLabel.Text = "Não foi possível conectar à API.";
            loginButton.Enabled = true;
        }
        catch (Exception)
        {
            errorLabel.Text = "Não foi possível concluir o login.";
            loginButton.Enabled = true;
        }
    }
}
```

### Task 3: Compose the application startup

**Files:**
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/Program.cs`

**Interfaces:**
- Reads the base URL from `ApiSettings.GetApiUrl()`.
- Shares `UserSession` between `LoginForm` and the API client's token provider.

- [ ] **Step 1: Replace startup composition**

Replace `Program.cs` with:

```csharp
using EduQuest.Admin.Desktop.Configuration;
using EduQuest.Admin.Desktop.Networking;
using EduQuest.Admin.Desktop.Session;

namespace EduQuest.Admin.Desktop;

static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();

        using var httpClient = new HttpClient();
        var session = new UserSession();
        var apiClient = new AdminApiClient(
            httpClient,
            ApiSettings.GetApiUrl(),
            () => session.AccessToken);

        Application.Run(new LoginForm(apiClient, session));
    }
}
```

- [ ] **Step 2: Run build**

Run:

```powershell
dotnet build
```

Expected: build succeeds with zero errors.

### Task 4: Document manual verification and finish roadmap

**Files:**
- Modify: `apps/desktop/README.md`
- Modify: `apps/desktop/ROADMAP.md`

- [ ] **Step 1: Document the manual login test**

Add to `README.md`:

```markdown
## Manual login test

1. Start the API at `http://localhost:3000`.
2. Run the desktop app with `dotnet run --project src/EduQuest.Admin.Desktop`.
3. Confirm empty e-mail or password shows validation without a request.
4. Confirm invalid credentials show the API error and keep the form open.
5. Confirm valid admin credentials open the main window.
```

- [ ] **Step 2: Mark Task 3 complete**

Change only the six Task 3 checklist items in `ROADMAP.md` from `[ ]` to `[x]` after build and manual validation.

- [ ] **Step 3: Run complete tests and build**

Run from `apps/desktop`:

```powershell
dotnet test
dotnet build
```

Expected: all tests pass and the build has zero errors and warnings.

- [ ] **Step 4: Review and commit**

```powershell
git status --short
git add apps/desktop
git commit -m "feat: add admin login flow"
```
