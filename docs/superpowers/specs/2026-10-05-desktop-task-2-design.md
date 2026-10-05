# Task 2: Admin API Client

## Goal

Add the typed HTTP client used by the EduQuest administrator desktop application to authenticate and perform the existing administrative user operations.

## Scope

- Create `LoginResponse`, `User`, `CreateUserRequest`, and `UpdateUserRequest` models.
- Create `AdminApiClient` with login, list, create, update, and deactivate methods.
- Add the Bearer token to protected requests.
- Convert non-success HTTP responses to an `ApiException` with status code and displayable message.
- Test the client with a fake `HttpMessageHandler`, without network access.
- Mark Task 2 complete in `ROADMAP.md` after all tests pass.

## API Contract

The client targets the configured API base URL and uses these routes:

| Operation | Method | Route | Response |
| --- | --- | --- | --- |
| Login | `POST` | `/auth/login` | `{ "accessToken": "..." }` |
| List users | `GET` | `/users` | `User[]` |
| Create user | `POST` | `/users` | `User` |
| Update user | `PATCH` | `/users/{id}` | `User` |
| Deactivate user | `PATCH` | `/users/{id}/deactivate` | `User` |

The user role remains a `string` so the client preserves the API values (`admin`, `teacher`, and `student`) without duplicating server validation rules.

## Design

`AdminApiClient` receives an `HttpClient` and a base URL. The caller can provide a `Func<string?>` token provider. Protected requests call that provider immediately before sending and add `Authorization: Bearer <token>` when a token exists. The client never stores or owns the JWT; Task 3 will use `UserSession` as the source of truth.

JSON uses `JsonSerializerDefaults.Web`, matching the API's camelCase payloads while allowing C# PascalCase properties. Request methods serialize their DTOs as JSON and response methods deserialize the expected model types.

`ApiException` derives from `Exception` and exposes `StatusCode`. For a failed response, the client reads the body and uses a JSON `message` string or the first item from a JSON `message` array when available. If no usable message exists, it uses `HTTP {statusCode}`. Network failures remain ordinary `HttpRequestException` instances so callers can distinguish unavailable API infrastructure from an HTTP error.

## Testing

Tests use a custom `HttpMessageHandler` that records the request and returns prepared responses. They verify:

- Login sends the expected JSON and deserializes `accessToken`.
- Protected requests include the Bearer token from the provider.
- Each user operation uses the expected HTTP method and route.
- Create and update requests serialize the correct body.
- A `401` response becomes `ApiException` with status code and message.
- A JSON error message array is converted into a displayable message.

No real API or credentials are required for the test suite.

## Constraints

- Use only the existing .NET and MSTest dependencies.
- Do not add UI, session storage, database access, or API routes not present in the server.
- Do not persist JWTs in `AdminApiClient`.
