using EduQuest.Admin.Desktop.Configuration;

namespace EduQuest.Admin.Desktop.Tests;

[TestClass]
[DoNotParallelize]
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

    [TestMethod]
    [DataRow(null, "https://file.example.test")]
    [DataRow("   ", "https://file.example.test")]
    [DataRow(" https://env.example.test/// ", "https://env.example.test")]
    public void ResolvesApiUrlFromEnvironmentOrSettingsFile(string? value, string expected)
    {
        Environment.SetEnvironmentVariable(EnvironmentVariable, value);
        WithSettingsFile("""{ "ApiUrl": " https://file.example.test/// " }""", expected);
    }

    [TestMethod]
    [DataRow(null)]
    [DataRow("{}")]
    [DataRow("""{ "ApiUrl": "   " }""")]
    [DataRow("{ invalid json")]
    public void UsesLocalhostWhenSettingsFileHasNoUsableUrl(string? contents)
    {
        Environment.SetEnvironmentVariable(EnvironmentVariable, null);
        WithSettingsFile(contents, "http://localhost:3000");
    }

    private static void WithSettingsFile(string? contents, string expected)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
        var original = File.Exists(path) ? File.ReadAllBytes(path) : null;
        try
        {
            if (contents is null)
                File.Delete(path);
            else
                File.WriteAllText(path, contents);

            Assert.AreEqual(expected, ApiSettings.GetApiUrl());
        }
        finally
        {
            if (original is null)
                File.Delete(path);
            else
                File.WriteAllBytes(path, original);
        }
    }
}
