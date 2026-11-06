## Why

The profile page does nothing: `UserprofileComponent` is an empty class with its template commented out, and the header's profile button links to `userprofile` while the route is `user`, so the page is not even reachable. Players cannot see which account they are signed in with, fix the display name they typed at registration, or change their password.

## What Changes

- Make the profile page reachable: the header profile button navigates to the profile route.
- Show the signed-in player's display name and email on the profile page.
- Let the player change their display name.
- Let a player with an email-and-password account change their password, after confirming the current password.
- Hide the password section for accounts that sign in with Google, since they have no password to change.
- Show clear success and failure feedback for both actions, in English, in the same form style as the login and register screens.

## Capabilities

### New Capabilities
- `user-profile`: the profile page: reaching it, showing account details, changing the display name and changing the password.

### Modified Capabilities
<!-- None: no existing spec covers the profile page. `auth-forms` is reused for the field and error conventions but its requirements do not change. -->

## Impact

- `src/app/user/userprofile.component.*` (rewritten), `src/app/nav/navigation/navigation.component.html` (link target)
- `src/app/core/auth/` (`auth-ops.ts`, `services/auth.service.ts`): new operations for updating the display name, reauthenticating and updating the password
- `e2e/`: a new profile spec against the Auth emulator
- No new dependencies. Firebase Auth already ships the needed functions.
- Out of scope: turning decks on or off per player (a follow-up change; the preference is intended to live in Firestore per user), changing the email address, profile photo upload, deleting the account, password reset by email.
