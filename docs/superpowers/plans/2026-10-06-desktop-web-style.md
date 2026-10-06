# Desktop Web Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the desktop login, user grid, and user dialog with the visual language of `apps/web`.

**Architecture:** Add one `UiTheme` helper containing the shared palette, font selection, and native WinForms styling helpers. Apply it at form construction without changing API, validation, session, or CRUD logic.

**Tech Stack:** C# .NET 10, WinForms, native controls only.

## Global Constraints

- Do not modify `apps/web`.
- Do not add a UI framework or font package to the desktop project.
- Do not change the existing desktop feature scope.
- Preserve readable text, focus behavior, keyboard buttons, and disabled states.

---

### Task 1: Create the shared desktop theme

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/UiTheme.cs`

**Interfaces:**
- Produces shared colors and font factory.
- Produces `StyleForm`, `StyleTextBox`, `StyleButton`, `StyleSecondaryButton`, and `StyleGrid` helpers.

- [ ] **Step 1: Add the theme implementation**

Create `UiTheme.cs`:

```csharp
namespace EduQuest.Admin.Desktop;

public static class UiTheme
{
    public static readonly Color Background = Color.FromArgb(166, 156, 243);
    public static readonly Color Primary = Color.FromArgb(118, 101, 232);
    public static readonly Color PrimaryHover = Color.FromArgb(105, 88, 220);
    public static readonly Color Accent = Color.FromArgb(238, 234, 255);
    public static readonly Color FieldBackground = Color.FromArgb(250, 249, 255);
    public static readonly Color Foreground = Color.FromArgb(41, 38, 61);
    public static readonly Color MutedForeground = Color.FromArgb(107, 114, 128);
    public static readonly Color Border = Color.FromArgb(229, 231, 235);
    public static readonly Color Error = Color.FromArgb(180, 35, 24);

    public static Font CreateFont(float size, FontStyle style = FontStyle.Regular)
    {
        try
        {
            return new Font("Geist Variable", size, style);
        }
        catch (ArgumentException)
        {
            return new Font("Segoe UI", size, style);
        }
    }

    public static void StyleForm(Form form, bool useBackground = true)
    {
        form.BackColor = useBackground ? Background : Color.White;
        form.ForeColor = Foreground;
        form.Font = CreateFont(10);
    }

    public static void StyleTextBox(TextBox textBox)
    {
        textBox.BackColor = FieldBackground;
        textBox.ForeColor = Foreground;
        textBox.BorderStyle = BorderStyle.FixedSingle;
        textBox.Font = CreateFont(10);
        textBox.Padding = new Padding(8, 5, 8, 5);
    }

    public static void StyleButton(Button button, bool primary = true)
    {
        button.AutoSize = true;
        button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderSize = primary ? 0 : 1;
        button.FlatAppearance.BorderColor = Border;
        button.BackColor = primary ? Primary : Color.White;
        button.ForeColor = primary ? Color.White : MutedForeground;
        button.Font = CreateFont(10, FontStyle.Bold);
        button.Padding = new Padding(14, 7, 14, 7);
        button.Cursor = Cursors.Hand;
    }

    public static void StyleGrid(DataGridView grid)
    {
        grid.BackgroundColor = Color.White;
        grid.BorderStyle = BorderStyle.None;
        grid.GridColor = Border;
        grid.EnableHeadersVisualStyles = false;
        grid.ColumnHeadersDefaultCellStyle.BackColor = Accent;
        grid.ColumnHeadersDefaultCellStyle.ForeColor = Foreground;
        grid.ColumnHeadersDefaultCellStyle.Font = CreateFont(9, FontStyle.Bold);
        grid.ColumnHeadersDefaultCellStyle.Padding = new Padding(8, 6, 8, 6);
        grid.DefaultCellStyle.BackColor = Color.White;
        grid.DefaultCellStyle.ForeColor = Foreground;
        grid.DefaultCellStyle.SelectionBackColor = Accent;
        grid.DefaultCellStyle.SelectionForeColor = Foreground;
        grid.DefaultCellStyle.Padding = new Padding(8, 5, 8, 5);
        grid.RowTemplate.Height = 36;
    }
}
```

### Task 2: Style the login form

**Files:**
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/LoginForm.cs`

- [ ] **Step 1: Apply the theme after controls are initialized**

In the constructor, after setting window properties, add:

```csharp
UiTheme.StyleForm(this);
UiTheme.StyleTextBox(emailTextBox);
UiTheme.StyleTextBox(passwordTextBox);
UiTheme.StyleButton(loginButton);
errorLabel.ForeColor = UiTheme.Error;
errorLabel.Font = UiTheme.CreateFont(9);
```

Set the layout as a white surface:

```csharp
layout.BackColor = Color.White;
layout.Margin = new Padding(0);
```

Set the title label to `UiTheme.Foreground` and bold 16px, and give the form a white content panel effect through the existing layout padding and centered fixed dialog.

- [ ] **Step 2: Add hover feedback without changing behavior**

After `loginButton.Click += LoginButton_Click;`, add:

```csharp
loginButton.MouseEnter += (_, _) => loginButton.BackColor = UiTheme.PrimaryHover;
loginButton.MouseLeave += (_, _) => loginButton.BackColor = UiTheme.Primary;
```

### Task 3: Style the main and user forms

**Files:**
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.cs`
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/MainForm.Designer.cs`
- Modify: `apps/desktop/src/EduQuest.Admin.Desktop/UserForm.cs`

- [ ] **Step 1: Style `MainForm` controls**

In the `MainForm` constructor after `InitializeComponent()`:

```csharp
UiTheme.StyleForm(this);
UiTheme.StyleGrid(usersGrid);
UiTheme.StyleButton(refreshButton, primary: false);
UiTheme.StyleButton(createButton);
UiTheme.StyleButton(editButton, primary: false);
UiTheme.StyleButton(deactivateButton, primary: false);
errorLabel.ForeColor = UiTheme.Error;
errorLabel.Font = UiTheme.CreateFont(9);
```

In `MainForm.Designer.cs`, set the toolbar to `BackColor = Color.White`, `Padding = new Padding(16, 10, 16, 10)`, and set the form's `ClientSize` to `980x560`. Keep the current grid and button behavior unchanged.

- [ ] **Step 2: Style `UserForm` controls**

In the `UserForm` constructor after window properties:

```csharp
UiTheme.StyleForm(this, useBackground: false);
UiTheme.StyleTextBox(nameTextBox);
UiTheme.StyleTextBox(emailTextBox);
UiTheme.StyleTextBox(passwordTextBox);
UiTheme.StyleButton(saveButton);
UiTheme.StyleButton(cancelButton, primary: false);
errorLabel.ForeColor = UiTheme.Error;
errorLabel.Font = UiTheme.CreateFont(9);
```

Set the form padding/layout surface to white and keep the role controls consistent with the styled text fields.

- [ ] **Step 3: Build after visual changes**

Run:

```powershell
dotnet build
```

Expected: build succeeds with zero errors and warnings.

### Task 4: Verify and launch the desktop app

**Files:**
- No additional files.

- [ ] **Step 1: Run automated verification**

From `apps/desktop`:

```powershell
dotnet test
dotnet build
```

Expected: all tests pass and the build succeeds without errors or warnings.

- [ ] **Step 2: Launch the app for visual inspection**

Run:

```powershell
$env:EDUQUEST_API_URL = "http://localhost:3000"
dotnet run --project src/EduQuest.Admin.Desktop
```

Inspect the login form, authenticated user grid, and create/edit dialog against the web palette. If the API is unavailable, the login screen should still open and show its connection error after submission.

- [ ] **Step 3: Review and commit**

```powershell
git status --short
git add apps/desktop
git commit -m "style: align desktop UI with web theme"
```
