# Desktop Task 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add administrator user listing and CRUD controls to the authenticated WinForms screen.

**Architecture:** `MainForm` owns the user grid and delegates create/edit input to a reusable code-first `UserForm`. Both forms receive the existing `AdminApiClient`; `MainForm` also receives `UserSession` so authorization failures can clear the session. The login form remains the application shell and reopens after an expired session.

**Tech Stack:** C# .NET 10, WinForms, `HttpClient`, MSTest.

## Global Constraints

- Use the existing API routes and DTOs only.
- Do not access the database directly.
- Do not add new dependencies.
- Keep the JWT only in `UserSession` memory.
- Do not add unrelated filtering, pagination, or search.
- Keep inactive users visible in the grid.

---

### Task 1: Create the reusable user form

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/UserForm.cs`

**Interfaces:**
- `UserForm(AdminApiClient apiClient, UserSession session, User? user = null)`.
- `bool IsEditMode { get; }`.
- `CreateUserRequest CreateRequest()`.
- `UpdateUserRequest UpdateRequest()`.

- [ ] **Step 1: Implement the code-first form**

Create `UserForm.cs`:

```csharp
using EduQuest.Admin.Desktop.Models;
using EduQuest.Admin.Desktop.Networking;

namespace EduQuest.Admin.Desktop;

public sealed class UserForm : Form
{
    private readonly AdminApiClient apiClient;
    private readonly User? user;
    private readonly TextBox nameTextBox = new() { Dock = DockStyle.Fill };
    private readonly TextBox emailTextBox = new() { Dock = DockStyle.Fill };
    private readonly TextBox passwordTextBox = new() { UseSystemPasswordChar = true, Dock = DockStyle.Fill };
    private readonly ComboBox roleComboBox = new() { DropDownStyle = ComboBoxStyle.DropDownList, Dock = DockStyle.Fill };
    private readonly Label roleValueLabel = new() { AutoSize = true };
    private readonly Label errorLabel = new() { ForeColor = Color.Firebrick, AutoSize = true };
    private readonly Button saveButton = new() { Text = "Salvar", AutoSize = true };
    private readonly Button cancelButton = new() { Text = "Cancelar", AutoSize = true, DialogResult = DialogResult.Cancel };

    public UserForm(AdminApiClient apiClient, User? user = null)
    {
        this.apiClient = apiClient;
        this.user = user;
        IsEditMode = user is not null;

        Text = IsEditMode ? "Editar usuário" : "Novo usuário";
        StartPosition = FormStartPosition.CenterParent;
        ClientSize = new Size(420, 300);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;

        roleComboBox.Items.AddRange(["admin", "teacher", "student"]);
        roleComboBox.SelectedIndex = 2;
        saveButton.Click += SaveButton_Click;

        var layout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(20),
            ColumnCount = 2,
            RowCount = 7,
        };
        layout.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 90));
        layout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        layout.Controls.Add(new Label { Text = "Nome", AutoSize = true }, 0, 0);
        layout.Controls.Add(nameTextBox, 1, 0);
        layout.Controls.Add(new Label { Text = "E-mail", AutoSize = true }, 0, 1);
        layout.Controls.Add(emailTextBox, 1, 1);
        layout.Controls.Add(new Label { Text = "Senha", AutoSize = true }, 0, 2);
        layout.Controls.Add(passwordTextBox, 1, 2);
        layout.Controls.Add(new Label { Text = "Papel", AutoSize = true }, 0, 3);
        layout.Controls.Add(roleComboBox, 1, 3);
        layout.Controls.Add(roleValueLabel, 1, 4);
        layout.Controls.Add(errorLabel, 0, 5);
        layout.SetColumnSpan(errorLabel, 2);
        var buttons = new FlowLayoutPanel { AutoSize = true, FlowDirection = FlowDirection.RightToLeft, Dock = DockStyle.Fill };
        buttons.Controls.Add(saveButton);
        buttons.Controls.Add(cancelButton);
        layout.Controls.Add(buttons, 0, 6);
        layout.SetColumnSpan(buttons, 2);
        Controls.Add(layout);

        AcceptButton = saveButton;
        CancelButton = cancelButton;

        if (user is not null)
        {
            nameTextBox.Text = user.Name;
            emailTextBox.Text = user.Email;
            roleComboBox.Visible = false;
            roleValueLabel.Text = user.Role;
        }
        else
        {
            roleValueLabel.Visible = false;
        }
    }

    public bool IsEditMode { get; }

    public CreateUserRequest CreateRequest()
    {
        return new CreateUserRequest(nameTextBox.Text.Trim(), emailTextBox.Text.Trim(), passwordTextBox.Text, roleComboBox.Text);
    }

    public UpdateUserRequest UpdateRequest()
    {
        return new UpdateUserRequest(
            nameTextBox.Text.Trim(),
            emailTextBox.Text.Trim(),
            string.IsNullOrWhiteSpace(passwordTextBox.Text) ? null : passwordTextBox.Text);
    }

    private async void SaveButton_Click(object? sender, EventArgs e)
    {
        errorLabel.Text = string.Empty;
        if (string.IsNullOrWhiteSpace(nameTextBox.Text) || string.IsNullOrWhiteSpace(emailTextBox.Text))
        {
            errorLabel.Text = "Nome e e-mail são obrigatórios.";
            return;
        }

        if (!IsEditMode && string.IsNullOrWhiteSpace(passwordTextBox.Text))
        {
            errorLabel.Text = "Senha é obrigatória para novos usuários.";
            return;
        }

        saveButton.Enabled = false;
        try
        {
            if (IsEditMode)
            {
                await apiClient.UpdateUserAsync(user!.Id, UpdateRequest());
            }
            else
            {
                await apiClient.CreateUserAsync(CreateRequest());
            }

            DialogResult = DialogResult.OK;
            Close();
        }
        catch (ApiException exception)
        {
            errorLabel.Text = exception.Message;
            saveButton.Enabled = true;
        }
        catch (HttpRequestException)
        {
            errorLabel.Text = "Não foi possível conectar à API.";
            saveButton.Enabled = true;
        }
        catch (Exception)
        {
            errorLabel.Text = "Não foi possível salvar o usuário.";
            saveButton.Enabled = true;
        }
    }
}
```

### Task 2: Implement the user grid and operations

**Files:**
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.cs`
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.Designer.cs`

**Interfaces:**
- `MainForm(AdminApiClient apiClient, UserSession session)`.
- Loads users with `GetUsersAsync()` when shown and refreshed.
- Opens `UserForm` for create/edit and calls `DeactivateUserAsync` after confirmation.

- [ ] **Step 1: Replace the empty form constructor and event logic**

Replace `MainForm.cs` with:

```csharp
using EduQuest.Admin.Desktop.Models;
using EduQuest.Admin.Desktop.Networking;
using EduQuest.Admin.Desktop.Session;

namespace EduQuest.Admin.Desktop;

public partial class MainForm : Form
{
    private readonly AdminApiClient apiClient;
    private readonly UserSession session;
    private readonly BindingSource userSource = new();
    private readonly DataGridView usersGrid = new();
    private readonly Button refreshButton = new() { Text = "Atualizar", AutoSize = true };
    private readonly Button createButton = new() { Text = "Novo", AutoSize = true };
    private readonly Button editButton = new() { Text = "Editar", AutoSize = true };
    private readonly Button deactivateButton = new() { Text = "Desativar", AutoSize = true };
    private readonly Label errorLabel = new() { ForeColor = Color.Firebrick, AutoSize = true };

    public MainForm(AdminApiClient apiClient, UserSession session)
    {
        this.apiClient = apiClient;
        this.session = session;
        InitializeComponent();
        ConfigureGrid();
        Shown += async (_, _) => await LoadUsersAsync();
        refreshButton.Click += async (_, _) => await LoadUsersAsync();
        createButton.Click += (_, _) => CreateUser();
        editButton.Click += (_, _) => EditUser();
        deactivateButton.Click += async (_, _) => await DeactivateUserAsync();
    }

    private void ConfigureGrid()
    {
        usersGrid.AutoGenerateColumns = false;
        usersGrid.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        usersGrid.DataSource = userSource;
        usersGrid.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
        usersGrid.MultiSelect = false;
        usersGrid.ReadOnly = true;
        usersGrid.Columns.Add(new DataGridViewTextBoxColumn { DataPropertyName = nameof(User.Name), HeaderText = "Nome" });
        usersGrid.Columns.Add(new DataGridViewTextBoxColumn { DataPropertyName = nameof(User.Email), HeaderText = "E-mail" });
        usersGrid.Columns.Add(new DataGridViewTextBoxColumn { DataPropertyName = nameof(User.Role), HeaderText = "Papel" });
        usersGrid.Columns.Add(new DataGridViewTextBoxColumn { DataPropertyName = nameof(User.IsActive), HeaderText = "Status" });
        usersGrid.CellFormatting += (_, args) =>
        {
            if (args.ColumnIndex == 3 && args.Value is bool isActive)
            {
                args.Value = isActive ? "Ativo" : "Inativo";
                args.FormattingApplied = true;
            }
        };
    }

    private async Task LoadUsersAsync()
    {
        SetBusy(true);
        errorLabel.Text = string.Empty;
        try
        {
            userSource.DataSource = (await apiClient.GetUsersAsync()).ToList();
        }
        catch (ApiException exception) when (exception.StatusCode is 401 or 403)
        {
            session.Clear();
            MessageBox.Show("Sua sessão expirou. Entre novamente.", "Sessão encerrada", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            Close();
        }
        catch (ApiException exception)
        {
            errorLabel.Text = exception.Message;
        }
        catch (HttpRequestException)
        {
            errorLabel.Text = "Não foi possível conectar à API.";
        }
        finally
        {
            SetBusy(false);
        }
    }

    private void CreateUser()
    {
        using var form = new UserForm(apiClient, session);
        if (form.ShowDialog(this) == DialogResult.OK)
        {
            _ = LoadUsersAsync();
        }
    }

    private void EditUser()
    {
        if (usersGrid.CurrentRow?.DataBoundItem is not User user) return;
        using var form = new UserForm(apiClient, session, user);
        if (form.ShowDialog(this) == DialogResult.OK)
        {
            _ = LoadUsersAsync();
        }
    }

    private async Task DeactivateUserAsync()
    {
        if (usersGrid.CurrentRow?.DataBoundItem is not User user) return;
        if (MessageBox.Show($"Desativar o usuário {user.Name}?", "Confirmar desativação", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes)
        {
            return;
        }

        SetBusy(true);
        try
        {
            await apiClient.DeactivateUserAsync(user.Id);
            await LoadUsersAsync();
        }
        catch (ApiException exception) when (exception.StatusCode is 401 or 403)
        {
            session.Clear();
            MessageBox.Show("Sua sessão expirou. Entre novamente.", "Sessão encerrada", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            Close();
        }
        catch (ApiException exception)
        {
            errorLabel.Text = exception.Message;
        }
        catch (HttpRequestException)
        {
            errorLabel.Text = "Não foi possível conectar à API.";
        }
        finally
        {
            SetBusy(false);
        }
    }

    private void SetBusy(bool busy)
    {
        refreshButton.Enabled = !busy;
        createButton.Enabled = !busy;
        editButton.Enabled = !busy;
        deactivateButton.Enabled = !busy;
        usersGrid.Enabled = !busy;
    }
}
```

- [ ] **Step 2: Replace the designer setup with the grid layout**

Replace `InitializeComponent` in `MainForm.Designer.cs` with:

```csharp
private void InitializeComponent()
{
    components = new System.ComponentModel.Container();
    var toolbar = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 42, Padding = new Padding(8), AutoSize = false };
    toolbar.Controls.Add(refreshButton);
    toolbar.Controls.Add(createButton);
    toolbar.Controls.Add(editButton);
    toolbar.Controls.Add(deactivateButton);
    usersGrid.Dock = DockStyle.Fill;
    errorLabel.Dock = DockStyle.Bottom;
    errorLabel.Padding = new Padding(8);
    Controls.Add(usersGrid);
    Controls.Add(errorLabel);
    Controls.Add(toolbar);
    AutoScaleMode = AutoScaleMode.Font;
    ClientSize = new Size(900, 520);
    Text = "EduQuest Admin - Usuários";
}
```

- [ ] **Step 3: Update login to pass dependencies and reopen after session expiry**

In `LoginForm.cs`, change the main-form block to:

```csharp
Hide();
using var mainForm = new MainForm(apiClient, session);
mainForm.ShowDialog(this);
if (session.AccessToken is null)
{
    Show();
    loginButton.Enabled = true;
    return;
}

Close();
```

- [ ] **Step 4: Update the focused build**

Run:

```powershell
dotnet build
```

Expected: build succeeds with zero errors.

### Task 3: Finish documentation and verification

**Files:**
- Modify: `apps/desktop/README.md`
- Modify: `apps/desktop/ROADMAP.md`

- [ ] **Step 1: Document manual CRUD verification**

Add to `README.md`:

```markdown
## Manual user-management test

After logging in as an administrator:

1. Confirm users load when the main window opens.
2. Use Atualizar and confirm the list reloads.
3. Use Novo to create a user and confirm it appears in the list.
4. Use Editar and confirm name, e-mail, and optional password update; role remains unchanged.
5. Use Desativar, cancel once, then confirm and verify the row remains visible as Inativo.
6. With an expired/invalid session, confirm a `401` or `403` returns to login.
```

- [ ] **Step 2: Mark Task 4 complete**

Change the eight Task 4 checklist items in `ROADMAP.md` to `[x]` only after manual CRUD validation. Keep the manual item unchecked if the API/database is unavailable.

- [ ] **Step 3: Run the complete suite and build**

Run from `apps/desktop`:

```powershell
dotnet test
dotnet build
```

Expected: all tests pass and the build succeeds with zero errors and warnings.

- [ ] **Step 4: Review and commit**

```powershell
git status --short
git add apps/desktop
git commit -m "feat: add user management screen"
```
