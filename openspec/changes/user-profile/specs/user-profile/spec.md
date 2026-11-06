# Spec Delta

## Purpose
Defines the profile page of a signed-in player: how to reach it, which account details it shows, and how the player changes their display name and password.

## ADDED Requirements

### Requirement: Profile page is reachable
The system SHALL let a signed-in player open the profile page from the profile button in the header. A visitor who is not signed in SHALL be sent to the login page instead.

#### Scenario: Open the profile page
- **WHEN** a signed-in player selects the profile button in the header
- **THEN** the profile page is shown

#### Scenario: Not signed in
- **WHEN** a visitor who is not signed in opens the profile page address
- **THEN** the login page is shown

### Requirement: Profile shows account details
The profile page SHALL show the player's display name and email address. When the account has no display name, the page SHALL show an empty name field rather than the text "undefined".

#### Scenario: Account with a display name
- **WHEN** a player registered as "Player One" with email "player@example.com" opens the profile page
- **THEN** the name "Player One" and the email "player@example.com" are shown

#### Scenario: Account without a display name
- **WHEN** a player whose account has no display name opens the profile page
- **THEN** the name field is empty
- **AND** the text "undefined" is not shown anywhere on the page

### Requirement: Display name can be changed
The system SHALL let the player change their display name. The name MUST NOT be empty. The new name SHALL be shown on the profile page immediately after it is saved, and SHALL still be shown after the page is reloaded.

#### Scenario: Valid new name
- **WHEN** the player enters "Dino Fan" and saves
- **THEN** a confirmation is shown
- **AND** the profile page shows "Dino Fan", also after a reload

#### Scenario: Empty name
- **WHEN** the player clears the name field and leaves it
- **THEN** the message "Name is required" is shown
- **AND** the save button is disabled

#### Scenario: Saving fails
- **WHEN** saving the name fails, for example because of a network error
- **THEN** the message "Could not save your name. Please try again." is shown
- **AND** the entered name stays in the field

### Requirement: Password can be changed
For an account that signs in with email and password, the system SHALL let the player change their password by entering the current password and a new password. The new password SHALL follow the same minimum length rule and message as the register form: at least 6 characters, with the message "Password minimum of 6 characters". The system SHALL NOT change the password unless the current password is correct.

#### Scenario: Valid change
- **WHEN** the player enters the correct current password and a new password of at least 6 characters, and saves
- **THEN** a confirmation is shown
- **AND** the password fields are cleared
- **AND** the player can sign in with the new password

#### Scenario: Wrong current password
- **WHEN** the player enters an incorrect current password and saves
- **THEN** the message "Your current password is incorrect." is shown
- **AND** the password is not changed

#### Scenario: New password too short
- **WHEN** the player leaves the new password field with fewer than 6 characters
- **THEN** the message "Password minimum of 6 characters" is shown
- **AND** the save button is disabled

#### Scenario: Other failure
- **WHEN** changing the password fails for any other reason, such as a network error
- **THEN** the message "Could not change your password. Please try again." is shown
- **AND** the password is not changed

### Requirement: Password section only for password accounts
The profile page SHALL show the password section only for accounts that sign in with email and password. For an account that signs in with Google, the password section SHALL NOT be shown, while the account details and the display name remain available.

#### Scenario: Google account
- **WHEN** a player who signed in with Google opens the profile page
- **THEN** no password fields are shown
- **AND** the display name can still be changed

#### Scenario: Email and password account
- **WHEN** a player with an email-and-password account opens the profile page
- **THEN** the password section is shown

### Requirement: Profile forms follow the auth form conventions
Every field on the profile page SHALL be labelled and SHALL announce its validation error as defined for the login and register forms. All visible text on the profile page SHALL be in English.

#### Scenario: Invalid touched field
- **WHEN** the player leaves an invalid field on the profile page
- **THEN** the input is marked invalid
- **AND** its error message is associated with the input
