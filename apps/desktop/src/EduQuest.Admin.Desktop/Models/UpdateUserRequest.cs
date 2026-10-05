namespace EduQuest.Admin.Desktop.Models;

public sealed record UpdateUserRequest(
    string? Name = null,
    string? Email = null,
    string? Password = null);
