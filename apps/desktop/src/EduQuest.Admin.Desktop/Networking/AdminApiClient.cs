using System.Net;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using System.Text;
using System.Text.Json;
using EduQuest.Admin.Desktop.Models;

namespace EduQuest.Admin.Desktop.Networking;

public sealed class AdminApiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };
    private readonly HttpClient httpClient;
    private readonly string baseUrl;
    private readonly Func<string?>? accessTokenProvider;

    public AdminApiClient(HttpClient httpClient, string baseUrl, Func<string?>? accessTokenProvider = null)
    {
        this.httpClient = httpClient;
        this.baseUrl = baseUrl.TrimEnd('/');
        this.accessTokenProvider = accessTokenProvider;
    }

    public Task<LoginResponse> LoginAsync(string email, string password)
    {
        return SendAsync<LoginResponse>(
            HttpMethod.Post,
            "/auth/login",
            new { email, password },
            requiresAuthentication: false);
    }

    public Task<IReadOnlyList<User>> GetUsersAsync()
    {
        return SendAsync<IReadOnlyList<User>>(HttpMethod.Get, "/users");
    }

    public Task<User> CreateUserAsync(CreateUserRequest request)
    {
        return SendAsync<User>(HttpMethod.Post, "/users", request);
    }

    public Task<User> UpdateUserAsync(string id, UpdateUserRequest request)
    {
        return SendAsync<User>(HttpMethod.Patch, $"/users/{Uri.EscapeDataString(id)}", request);
    }

    public Task<User> DeactivateUserAsync(string id)
    {
        return SendAsync<User>(HttpMethod.Patch, $"/users/{Uri.EscapeDataString(id)}/deactivate");
    }

    private async Task<T> SendAsync<T>(
        HttpMethod method,
        string route,
        object? body = null,
        bool requiresAuthentication = true)
    {
        using var request = new HttpRequestMessage(method, $"{baseUrl}{route}");
        if (body is not null)
        {
            request.Content = new StringContent(
                JsonSerializer.Serialize(body, JsonOptions),
                Encoding.UTF8,
                "application/json");
        }

        if (requiresAuthentication)
        {
            var token = accessTokenProvider?.Invoke();
            if (!string.IsNullOrWhiteSpace(token))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
        }

        using var response = await httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new ApiException((int)response.StatusCode, GetErrorMessage(content, response.StatusCode));
        }

        return JsonSerializer.Deserialize<T>(content, JsonOptions)
            ?? throw new InvalidOperationException("API returned an empty response.");
    }

    private static string GetErrorMessage(string content, HttpStatusCode statusCode)
    {
        try
        {
            using var document = JsonDocument.Parse(content);
            if (document.RootElement.TryGetProperty("message", out var message))
            {
                if (message.ValueKind == JsonValueKind.String)
                {
                    return message.GetString() ?? $"HTTP {(int)statusCode}";
                }

                if (message.ValueKind == JsonValueKind.Array && message.GetArrayLength() > 0)
                {
                    return message[0].GetString() ?? $"HTTP {(int)statusCode}";
                }
            }
        }
        catch (JsonException)
        {
        }

        return $"HTTP {(int)statusCode}";
    }
}
