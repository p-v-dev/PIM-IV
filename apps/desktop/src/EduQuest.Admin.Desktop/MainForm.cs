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
        UiTheme.StyleForm(this);
        UiTheme.StyleGrid(usersGrid);
        UiTheme.StyleButton(refreshButton, primary: false);
        UiTheme.StyleButton(createButton);
        UiTheme.StyleButton(editButton, primary: false);
        UiTheme.StyleButton(deactivateButton, primary: false);
        errorLabel.ForeColor = UiTheme.Error;
        errorLabel.Font = UiTheme.CreateFont(9);
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
            ExpireSession();
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
        else if (session.AccessToken is null)
        {
            ExpireSession(showMessage: false);
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
        else if (session.AccessToken is null)
        {
            ExpireSession(showMessage: false);
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
            ExpireSession();
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

    private void ExpireSession(bool showMessage = true)
    {
        session.Clear();
        if (showMessage)
        {
            MessageBox.Show("Sua sessão expirou. Entre novamente.", "Sessão encerrada", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

        Close();
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
