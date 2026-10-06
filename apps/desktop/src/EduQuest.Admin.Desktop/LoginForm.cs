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
        UiTheme.StyleForm(this);
        UiTheme.StyleTextBox(emailTextBox);
        UiTheme.StyleTextBox(passwordTextBox);
        UiTheme.StyleButton(loginButton);
        errorLabel.ForeColor = UiTheme.Error;
        errorLabel.Font = UiTheme.CreateFont(9);

        var layout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(24),
            ColumnCount = 1,
            RowCount = 5,
            BackColor = Color.White,
            Margin = new Padding(36),
        };
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        layout.RowStyles.Add(new RowStyle(SizeType.AutoSize));
        var titleLabel = new Label
        {
            Text = "Acesso administrativo",
            AutoSize = true,
            ForeColor = UiTheme.Foreground,
            Font = UiTheme.CreateFont(16, FontStyle.Bold),
            Margin = new Padding(0, 0, 0, 10),
        };
        layout.Controls.Add(titleLabel, 0, 0);
        layout.Controls.Add(emailTextBox, 0, 1);
        layout.Controls.Add(passwordTextBox, 0, 2);
        layout.Controls.Add(errorLabel, 0, 3);
        layout.Controls.Add(loginButton, 0, 4);
        Controls.Add(layout);

        AcceptButton = loginButton;
        loginButton.Click += LoginButton_Click;
        loginButton.MouseEnter += (_, _) => loginButton.BackColor = UiTheme.PrimaryHover;
        loginButton.MouseLeave += (_, _) => loginButton.BackColor = UiTheme.Primary;
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
            using var mainForm = new MainForm(apiClient, session);
            mainForm.ShowDialog(this);
            if (session.AccessToken is null)
            {
                Show();
                loginButton.Enabled = true;
                return;
            }

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
