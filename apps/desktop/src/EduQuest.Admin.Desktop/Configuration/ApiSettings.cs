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
