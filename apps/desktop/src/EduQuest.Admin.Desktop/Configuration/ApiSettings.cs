using System.Text.Json;

namespace EduQuest.Admin.Desktop.Configuration;

public static class ApiSettings
{
    public const string DefaultUrl = "http://localhost:3000";

    public static string GetApiUrl()
    {
        var environmentUrl = Environment.GetEnvironmentVariable("EDUQUEST_API_URL");
        if (!string.IsNullOrWhiteSpace(environmentUrl))
            return environmentUrl.Trim().TrimEnd('/');

        try
        {
            var path = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
            using var settings = JsonDocument.Parse(File.ReadAllText(path));
            if (settings.RootElement.ValueKind == JsonValueKind.Object &&
                settings.RootElement.TryGetProperty("ApiUrl", out var apiUrl) &&
                apiUrl.ValueKind == JsonValueKind.String &&
                apiUrl.GetString() is { } fileUrl && !string.IsNullOrWhiteSpace(fileUrl))
            {
                return fileUrl.Trim().TrimEnd('/');
            }
        }
        catch (Exception exception) when (exception is IOException or UnauthorizedAccessException or JsonException)
        {
            // The settings file is optional; keep the local default if it cannot be read.
        }

        return DefaultUrl;
    }
}
