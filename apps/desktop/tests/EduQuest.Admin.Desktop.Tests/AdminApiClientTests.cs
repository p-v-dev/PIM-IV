using System.Net;
using System.Text;
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
            handler.RequestBody);
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
        StringAssert.Contains(handler.RequestBody, "\"role\":\"student\"");

        await client.UpdateUserAsync("user-1", new UpdateUserRequest(Name: "Updated"));
        Assert.AreEqual(HttpMethod.Patch, handler.Request.Method);
        Assert.AreEqual("https://api.example.test/users/user-1", handler.Request.RequestUri!.ToString());
        Assert.AreEqual("{\"name\":\"Updated\"}", handler.RequestBody);

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

        var exception = await Assert.ThrowsAsync<ApiException>(() => client.GetUsersAsync());

        Assert.AreEqual(401, exception.StatusCode);
        Assert.AreEqual("Authentication required", exception.Message);
    }

    [TestMethod]
    public async Task ErrorMessageArrayUsesFirstMessage()
    {
        var handler = new RecordingHandler(_ => JsonResponse("{\"message\":[\"email must be an email\",\"name is required\"]}", HttpStatusCode.BadRequest));
        using var httpClient = new HttpClient(handler);
        var client = new AdminApiClient(httpClient, "https://api.example.test");

        var exception = await Assert.ThrowsAsync<ApiException>(() => client.GetUsersAsync());

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
        public string RequestBody { get; private set; } = string.Empty;

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Request = request;
            RequestBody = request.Content is null
                ? string.Empty
                : await request.Content.ReadAsStringAsync(cancellationToken);
            return responder(request);
        }
    }
}
