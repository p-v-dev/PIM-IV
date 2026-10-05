namespace EduQuest.Admin.Desktop.Models;

public sealed record CreateUserRequest(
    string Name,
    string Email,
    string Password,
    string Role);
