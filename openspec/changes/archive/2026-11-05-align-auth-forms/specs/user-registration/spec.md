# Spec Delta

## MODIFIED Requirements

### Requirement: Registration form validation
The system SHALL require a name, a valid email address and a password of at least 6 characters, show a message per invalid field once it has been touched, and keep the Register button disabled while the form is invalid or a registration is in progress.

#### Scenario: Empty form
- **WHEN** the register form is empty
- **THEN** the Register button is disabled

#### Scenario: Invalid email
- **WHEN** the visitor leaves the email field with "not-an-email"
- **THEN** the message "Please enter a valid email" is shown

#### Scenario: Short password
- **WHEN** the visitor leaves the password field with fewer than 6 characters
- **THEN** the message "Password minimum of 6 characters" is shown
