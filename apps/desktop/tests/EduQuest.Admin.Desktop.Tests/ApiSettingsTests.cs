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
}
