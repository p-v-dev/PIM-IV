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
