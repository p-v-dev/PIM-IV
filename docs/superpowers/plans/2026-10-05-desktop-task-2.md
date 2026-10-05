# Desktop Task 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typed, testable HTTP client for admin login and user management.

**Architecture:** `AdminApiClient` owns request construction and response parsing but receives an `HttpClient` from the caller. A token provider delegate supplies the current JWT at request time without storing it in the client. `ApiException` represents HTTP failures with a status code and displayable message.

**Tech Stack:** C# .NET 10, `HttpClient`, `System.Text.Json`, MSTest.

## Global Constraints

- Use only the existing .NET and MSTest dependencies.
- Keep `Role` as `string`.
- Do not persist JWTs in `AdminApiClient`.
- Do not add UI, session storage, database access, or new API routes.
- Use API routes `/auth/login`, `/users`, `/users/{id}`, and `/users/{id}/deactivate`.

---

### Task 1: Add API models and exception types

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Models/LoginResponse.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Models/User.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Models/CreateUserRequest.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Models/UpdateUserRequest.cs`
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Networking/ApiException.cs`

**Interfaces:**
- Produces `LoginResponse.AccessToken`.
- Produces `User.Id`, `Name`, `Email`, `Role`, and `IsActive`.
- Produces request DTOs with the exact API fields.
- Produces `ApiException(int statusCode, string message)` with `StatusCode`.

- [ ] **Step 1: Create the model records**

Create the four immutable records:

```csharp
namespace EduQuest.Admin.Desktop.Models;

public sealed record LoginResponse(string AccessToken);
```

```csharp
namespace EduQuest.Admin.Desktop.Models;

public sealed record User(
    string Id,
    string Name,
    string Email,
    string Role,
    bool IsActive);
```

```csharp
namespace EduQuest.Admin.Desktop.Models;

public sealed record CreateUserRequest(
    string Name,
    string Email,
    string Password,
    string Role);
```

```csharp
namespace EduQuest.Admin.Desktop.Models;

public sealed record UpdateUserRequest(
    string? Name = null,
    string? Email = null,
    string? Password = null);
```

- [ ] **Step 2: Create `ApiException`**

Create `Networking/ApiException.cs`:

```csharp
namespace EduQuest.Admin.Desktop.Networking;

public sealed class ApiException : Exception
{
    public ApiException(int statusCode, string message)
        : base(message)
    {
        StatusCode = statusCode;
    }

    public int StatusCode { get; }
}
```

### Task 2: Add the failing HTTP client tests

**Files:**
- Create: `apps/desktop/tests/EduQuest.Admin.Desktop.Tests/AdminApiClientTests.cs`

**Interfaces:**
- Tests consume `AdminApiClient(HttpClient, string, Func<string?>?)`.
- Tests expect `LoginAsync`, `GetUsersAsync`, `CreateUserAsync`, `UpdateUserAsync`, and `DeactivateUserAsync` with the signatures defined below.

- [ ] **Step 1: Add the fake handler and request tests**

Create `AdminApiClientTests.cs`:

```csharp
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using EduQuest.Admin.Desktop.Models;
using EduQuest.Admin.Desktop.Networking;

namespace EduQuest.Admin.Desktop.Tests;

[TestClass]
public class AdminApiClientTests
{
    [TestMethod]
    public async Task LoginPostsCredentialsAndReadsAccessToken()
    {
        var handler = new RecordingHandler(_ => JsonResponse("{\"accessToken\":\"jwt-token\"}"));
        using var httpClient = new HttpClient(handler);
        var client = new AdminApiClient(httpClient, "https://api.example.test");

        var result = await client.LoginAsync("admin@example.test", "password");

        Assert.AreEqual("jwt-token", result.AccessToken);
        Assert.AreEqual(HttpMethod.Post, handler.Request.Method);
        Assert.AreEqual("https://api.example.test/auth/login", handler.Request.RequestUri!.ToString());
        Assert.AreEqual(
            "{\"email\":\"admin@example.test\",\"password\":\"password\"}",
            await handler.Request.Content!.ReadAsStringAsync());
    }

    [TestMethod]
    public async Task GetUsersSendsBearerToken()
    {
        var handler = new RecordingHandler(_ => JsonResponse("[]"));
        using var httpClient = new HttpClient(handler);
        var client = new AdminApiClient(httpClient, "https://api.example.test", () => "jwt-token");

        await client.GetUsersAsync();

        Assert.AreEqual("Bearer jwt-token", handler.Request.Headers.Authorization!.ToString());
    }

    [TestMethod]
    public async Task UserOperationsUseExpectedRoutesAndBodies()
    {
        var handler = new RecordingHandler(_ => JsonResponse("{\"id\":\"user-1\",\"name\":\"Name\",\"email\":\"name@example.test\",\"role\":\"student\",\"isActive\":true}"));
        using var httpClient = new HttpClient(handler);
        var client = new AdminApiClient(httpClient, "https://api.example.test", () => "jwt-token");

        await client.CreateUserAsync(new CreateUserRequest("Name", "name@example.test", "password", "student"));
        Assert.AreEqual(HttpMethod.Post, handler.Request.Method);
        Assert.AreEqual("https://api.example.test/users", handler.Request.RequestUri!.ToString());

        await client.UpdateUserAsync("user-1", new UpdateUserRequest(Name: "Updated"));
        Assert.AreEqual(HttpMethod.Patch, handler.Request.Method);
        Assert.AreEqual("https://api.example.test/users/user-1", handler.Request.RequestUri!.ToString());

        await client.DeactivateUserAsync("user-1");
        Assert.AreEqual(HttpMethod.Patch, handler.Request.Method);
        Assert.AreEqual("https://api.example.test/users/user-1/deactivate", handler.Request.RequestUri!.ToString());
    }

    [TestMethod]
    public async Task UnauthorizedResponseBecomesApiException()
    {
        var handler = new RecordingHandler(_ => JsonResponse("{\"message\":\"Authentication required\"}", HttpStatusCode.Unauthorized));
        using var httpClient = new HttpClient(handler);
        var client = new AdminApiClient(httpClient, "https://api.example.test");

        var exception = await Assert.ThrowsExceptionAsync<ApiException>(() => client.GetUsersAsync());

        Assert.AreEqual(401, exception.StatusCode);
        Assert.AreEqual("Authentication required", exception.Message);
    }

    [TestMethod]
    public async Task ErrorMessageArrayUsesFirstMessage()
    {
        var handler = new RecordingHandler(_ => JsonResponse("{\"message\":[\"email must be an email\",\"name is required\"]}", HttpStatusCode.BadRequest));
        using var httpClient = new HttpClient(handler);
        var client = new AdminApiClient(httpClient, "https://api.example.test");

        var exception = await Assert.ThrowsExceptionAsync<ApiException>(() => client.GetUsersAsync());

        Assert.AreEqual("email must be an email", exception.Message);
    }

    private static HttpResponseMessage JsonResponse(string json, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return new HttpResponseMessage(statusCode)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json"),
        };
    }

    private sealed class RecordingHandler(Func<HttpRequestMessage, HttpResponseMessage> responder) : HttpMessageHandler
    {
        public HttpRequestMessage Request { get; private set; } = null!;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Request = request;
            return Task.FromResult(responder(request));
        }
    }
}
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run:

```powershell
dotnet test tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj --filter AdminApiClientTests
```

Expected: FAIL because `AdminApiClient` does not exist yet.

### Task 3: Implement the minimal HTTP client

**Files:**
- Create: `apps/desktop/src/EduQuest.Admin.Desktop/Networking/AdminApiClient.cs`

**Interfaces:**
- `AdminApiClient(HttpClient httpClient, string baseUrl, Func<string?>? accessTokenProvider = null)`.
- `Task<LoginResponse> LoginAsync(string email, string password)`.
- `Task<IReadOnlyList<User>> GetUsersAsync()`.
- `Task<User> CreateUserAsync(CreateUserRequest request)`.
- `Task<User> UpdateUserAsync(string id, UpdateUserRequest request)`.
- `Task<User> DeactivateUserAsync(string id)`.

- [ ] **Step 1: Implement request construction, JSON, and error conversion**

Create `Networking/AdminApiClient.cs`:

```csharp
using System.Net.Http.Headers;
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

    private async Task<T> SendAsync<T>(HttpMethod method, string route, object? body = null, bool requiresAuthentication = true)
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

    private static string GetErrorMessage(string content, System.Net.HttpStatusCode statusCode)
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
```

- [ ] **Step 2: Run focused tests and confirm success**

Run:

```powershell
dotnet test tests/EduQuest.Admin.Desktop.Tests/EduQuest.Admin.Desktop.Tests.csproj --filter AdminApiClientTests
```

Expected: all client tests pass.

### Task 4: Finish documentation and verification

**Files:**
- Modify: `apps/desktop/ROADMAP.md`

- [ ] **Step 1: Mark Task 2 complete**

Change only the six Task 2 checklist items from `[ ]` to `[x]` after tests pass.

- [ ] **Step 2: Run the complete suite and build**

From `apps/desktop`, run:

```powershell
dotnet test
dotnet build
```

Expected: all tests pass, build succeeds with zero errors and zero warnings.

- [ ] **Step 3: Review intended files**

Run:

```powershell
git status --short
git diff -- apps/desktop
```

Confirm build output remains ignored and no credentials or unrelated files are staged.

- [ ] **Step 4: Commit the implementation**

```powershell
git add apps/desktop
git commit -m "feat: add admin API client"
```
