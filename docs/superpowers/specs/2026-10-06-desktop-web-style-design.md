# Desktop Web Style Alignment

## Goal

Apply the visual language already used by `apps/web` to the WinForms login, user-management, and user-editing forms without changing their behavior.

## Source Style

The web implementation in `apps/web/src/pages/Professor.jsx` uses a light EduQuest theme with a lavender page background, white elevated surfaces, violet actions, large rounded corners, soft shadows, and muted gray secondary text. Its main values are:

- Background: `#a69cf3`
- Primary: `#7665e8`
- Primary hover: `#6958dc`
- Accent: `#eeeaff`
- Field background: `#faf9ff`
- Foreground: `#29263d`
- Muted foreground: `#6b7280`
- Border: `#e5e7eb`
- Error: `#b42318`
- Radius language: approximately 12px for controls and 22-24px for cards.

The web base stylesheet also uses Geist Variable. The desktop app will use Geist when installed and fall back to native `Segoe UI` without adding a font dependency.

## Design

Create a small `UiTheme` class containing the shared colors, font factory, form setup, and control styling helpers. It will style controls using native WinForms properties: `BackColor`, `ForeColor`, `FlatStyle`, `Padding`, `Margin`, `Font`, and border settings available on standard controls. No custom owner-drawn controls or third-party dependencies are needed.

`LoginForm` will use the lavender background with a centered white panel, violet title accent, pale inputs, and a prominent violet submit button. `MainForm` will use the lavender background, a white top header/toolbar area, a white grid surface, pale violet header/selection colors, and consistent action buttons. `UserForm` will use a white dialog surface with pale inputs and primary/secondary actions.

The current API calls, validation, session flow, CRUD operations, and error handling remain unchanged. Theme application happens during form construction after controls are created.

## Accessibility and States

- Preserve readable dark text on white and pale backgrounds.
- Keep error text distinct with the red error color.
- Keep disabled controls visibly muted through native disabled rendering.
- Use focus cues from standard WinForms controls rather than removing keyboard focus behavior.
- Keep existing labels and keyboard `AcceptButton`/`CancelButton` behavior.

## Verification

- Run `dotnet test` and `dotnet build`.
- Launch the desktop app and visually inspect login, main grid, and user dialog against the documented web palette.
- Confirm no API request, validation, or navigation behavior changes.

## Constraints

- Do not modify `apps/web`.
- Do not add a UI framework or font package to the desktop project.
- Do not change the existing desktop feature scope.
