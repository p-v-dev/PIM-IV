# Task 4: User Management

## Goal

Turn the empty authenticated main window into an administrator screen for listing, creating, editing, refreshing, and deactivating users through the existing API.

## Scope

- Add a `DataGridView` showing name, e-mail, role, and active status.
- Load users on opening and when refreshing.
- Add a reusable `UserForm` for creation and editing.
- Keep role read-only during editing.
- Confirm before deactivation.
- Keep inactive users visible.
- Clear the session and return to login on `401` or `403`.
- Document manual CRUD validation against the local API.

## Design

`MainForm` receives `AdminApiClient` and `UserSession`. It creates its controls in code and keeps a private `IReadOnlyList<User>` for the current grid data. The `Shown` event calls `LoadUsersAsync`; the refresh button calls the same method. Each successful create, update, or deactivate operation reloads the list from the API instead of mutating a potentially stale local copy.

The grid uses explicit columns for `Name`, `Email`, `Role`, and `IsActive`, with the status displayed as `Ativo` or `Inativo`. Inactive users are not filtered out. The selected row's user id is stored through the row's bound `User` object.

`UserForm` receives either no user for creation or an existing user for editing. Creation shows name, e-mail, password, and a role combo box with `admin`, `teacher`, and `student`. Editing shows name, e-mail, and password, while role is displayed as read-only text and is not sent in `UpdateUserRequest`. Empty required values are rejected locally; an empty edit password is sent as `null` so the API keeps the current password.

The deactivation flow requires a confirmation dialog before calling `DeactivateUserAsync`. The grid is refreshed after the server response, so the user remains visible with status `Inativo`.

## Session Expiration

`MainForm` treats `ApiException.StatusCode` 401 and 403 as session expiration or insufficient authorization. It clears `UserSession`, displays a warning, and closes itself. `LoginForm` checks whether the session still has a token after the modal main form closes; if not, it shows itself again instead of closing the application. Other API errors stay on the current form and show the exception message.

## Testing

The existing `AdminApiClient` HTTP tests remain the automated coverage for API routes and payloads. Manual validation covers opening/loading, refresh, create, edit without role changes, inactive-row display, confirmation before deactivation, and login return after a forced `401/403`. The complete .NET test suite and build must pass.

## Constraints

- Use the existing API routes and DTOs only.
- Do not access the database directly.
- Do not add new dependencies.
- Keep the JWT only in `UserSession` memory.
- Do not add unrelated filtering, pagination, or search to this task.
