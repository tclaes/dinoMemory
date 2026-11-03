## ADDED Requirements

### Requirement: Register screen layout
The system SHALL show the register card centred in the viewport, with the same page background and card styling as the login screen, on both mobile and desktop widths.

#### Scenario: Desktop viewport
- **WHEN** a visitor opens `/register` on a desktop-width viewport
- **THEN** the register card is centred horizontally and vertically on the page background

#### Scenario: Small viewport
- **WHEN** a visitor opens `/register` on a narrow mobile viewport
- **THEN** the card fits the width with side padding and no horizontal scrolling

### Requirement: Registration form validation
The system SHALL require a name, a valid email address and a password of at least 6 characters, show a message per invalid field once it has been touched, and keep the Register button disabled while the form is invalid or a registration is in progress.

#### Scenario: Empty form
- **WHEN** the register form is empty
- **THEN** the Register button is disabled

#### Scenario: Invalid email
- **WHEN** the visitor leaves the email field with "not-an-email"
- **THEN** the message "Please enter a valid email address" is shown

#### Scenario: Short password
- **WHEN** the visitor leaves the password field with fewer than 6 characters
- **THEN** the message "Min password length is 6" is shown

### Requirement: Successful registration
The system SHALL create the account, store the entered name as the display name, sign the new user in and navigate to the game page.

#### Scenario: Valid registration
- **WHEN** a visitor submits a name, an unused email and a password of at least 6 characters
- **THEN** the account is created with the entered name as display name
- **AND** the visitor is on the game page, signed in

### Requirement: Registration failure feedback
The system SHALL show a visible error on the register form when registration fails and SHALL keep the visitor on the form with the entered values.

#### Scenario: Email already in use
- **WHEN** a visitor submits an email that already has an account
- **THEN** the form shows an error that the email is already in use
- **AND** the visitor stays on `/register`

#### Scenario: Other failure
- **WHEN** registration fails for any other reason, such as a network error
- **THEN** the form shows a generic "Registration failed. Please try again." error
- **AND** the Register button is enabled again
