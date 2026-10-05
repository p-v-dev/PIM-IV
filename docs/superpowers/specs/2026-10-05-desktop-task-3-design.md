# Task 3: Login and Session

## Goal

Add the administrator login flow, keep the JWT in memory for the process lifetime, and open the authenticated main window only after a successful API login.

## Scope

- Create `UserSession` for in-memory JWT storage.
- Replace the startup shell with explicit composition of `HttpClient`, session, API client, and forms.
- Create `LoginForm` with email, password, submit button, and error message.
- Reject empty fields locally without calling the API.
- Disable the submit button while login is in progress.
- Store the returned JWT only in `UserSession`.
- Open the existing empty `MainForm` only after successful login.
- Show concise messages for API errors and unavailable API infrastructure.
- Add automated tests for `UserSession` and document manual login validation against localhost.

## Design

`Program` owns application composition. It creates one `HttpClient`, one `UserSession`, and one `AdminApiClient` configured with `ApiSettings.GetApiUrl()` and a token provider that reads `session.AccessToken`. It starts `LoginForm` with those dependencies. This keeps the token source in the session while allowing protected API calls in later tasks.

`UserSession` exposes a nullable `AccessToken`, `SetToken(string)`, and `Clear()`. It does not serialize or persist data. The client receives only the token provider delegate and does not own the token.

`LoginForm` uses standard WinForms controls: email `TextBox`, password `TextBox` with `UseSystemPasswordChar`, login `Button`, and error `Label`. The click handler trims the email, validates that both fields are non-empty, disables the button, calls `LoginAsync`, stores the token, hides itself, and opens `MainForm`. If the main form closes, the login form closes as well. A failed request re-enables the button and displays an appropriate error without closing the form.

The `MainForm` remains the existing empty placeholder. User management controls belong to Task 4.

## Error Handling

- Empty email or password: local validation message, no HTTP request.
- `ApiException`: show `exception.Message` from the API client.
- `HttpRequestException`: show `Não foi possível conectar à API.`.
- Other exceptions: show `Não foi possível concluir o login.`.

## Testing

`UserSessionTests` verify that a token can be set, read, and cleared. Login UI validation and the end-to-end form transition require Windows UI interaction and are documented as a manual test against `http://localhost:3000`. No token or credentials are added to automated tests or repository files.

## Constraints

- Target `net10.0-windows` and use existing WinForms/MSTest dependencies.
- Keep the JWT only in memory.
- Do not implement user management controls in `MainForm` yet.
- Do not add persistent configuration for credentials or tokens.
