using EduQuest.Admin.Desktop.Models;
using EduQuest.Admin.Desktop.Networking;
using EduQuest.Admin.Desktop.Session;

namespace EduQuest.Admin.Desktop;

public sealed class UserForm : Form
{
    private readonly AdminApiClient apiClient;
    private readonly UserSession session;
    private readonly User? user;
    private readonly TextBox nameTextBox = new() { Dock = DockStyle.Fill };
    private readonly TextBox emailTextBox = new() { Dock = DockStyle.Fill };
    private readonly TextBox passwordTextBox = new() { UseSystemPasswordChar = true, Dock = DockStyle.Fill };
    private readonly ComboBox roleComboBox = new() { DropDownStyle = ComboBoxStyle.DropDownList, Dock = DockStyle.Fill };
    private readonly Label roleValueLabel = new() { AutoSize = true };
    private readonly Label errorLabel = new() { ForeColor = Color.Firebrick, AutoSize = true };
    private readonly Button saveButton = new() { Text = "Salvar", AutoSize = true };
    private readonly Button cancelButton = new() { Text = "Cancelar", AutoSize = true, DialogResult = DialogResult.Cancel };

    public UserForm(AdminApiClient apiClient, UserSession session, User? user = null)
    {
        this.apiClient = apiClient;
        this.session = session;
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
        catch (ApiException exception) when (exception.StatusCode is 401 or 403)
        {
            session.Clear();
            DialogResult = DialogResult.Cancel;
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
