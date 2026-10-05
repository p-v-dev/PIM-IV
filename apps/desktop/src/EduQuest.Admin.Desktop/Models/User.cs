namespace EduQuest.Admin.Desktop.Models;

public sealed record User(
    string Id,
    string Name,
    string Email,
    string Role,
    bool IsActive);
