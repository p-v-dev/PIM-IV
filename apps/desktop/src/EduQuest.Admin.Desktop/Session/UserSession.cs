namespace EduQuest.Admin.Desktop.Session;

public sealed class UserSession
{
    public string? AccessToken { get; private set; }

    public void SetToken(string token)
    {
        AccessToken = token;
    }

    public void Clear()
    {
        AccessToken = null;
    }
}
