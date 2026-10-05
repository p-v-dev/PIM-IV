using EduQuest.Admin.Desktop.Session;

namespace EduQuest.Admin.Desktop.Tests;

[TestClass]
public class UserSessionTests
{
    [TestMethod]
    public void StoresAndClearsTokenInMemory()
    {
        var session = new UserSession();

        Assert.IsNull(session.AccessToken);

        session.SetToken("jwt-token");
        Assert.AreEqual("jwt-token", session.AccessToken);

        session.Clear();
        Assert.IsNull(session.AccessToken);
    }
}
