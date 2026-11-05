# auth-forms Specification

## Purpose
Defines the behavior that the login and register forms share: how fields are labelled, how validation errors are presented and announced, and the language of the interface text.

## Requirements

### Requirement: Fields are labelled
Every input on the login and register forms SHALL have a visible label that is programmatically associated with the input, so that it can be found by its label text.

#### Scenario: Find a field by label
- **WHEN** a user or assistive technology looks up the "Email" field on either form
- **THEN** exactly one input is found for that label

### Requirement: Validation errors are announced
When a touched field is invalid, the form SHALL mark the input as invalid and SHALL show an error message that is associated with the input and announced to assistive technology.

#### Scenario: Invalid touched field
- **WHEN** the user leaves the email field with "not-an-email"
- **THEN** the input is marked invalid
- **AND** an error message is shown that is associated with that input

#### Scenario: Valid field
- **WHEN** a field is valid
- **THEN** it is not marked invalid and shows no error message

### Requirement: Same validation rules and messages on both forms
The login and register forms SHALL apply the same rules and show the same message text for the fields they share: email is required and must be a valid address, and the password is required and has a minimum of 6 characters.

#### Scenario: Invalid email on either form
- **WHEN** the user leaves the email field with an invalid address on the login form or the register form
- **THEN** both forms show "Please enter a valid email"

#### Scenario: Short password on either form
- **WHEN** the user leaves the password field with fewer than 6 characters on either form
- **THEN** both forms show "Password minimum of 6 characters"

### Requirement: Submit uses what the user just typed
The login and register forms SHALL submit the email address as it currently appears in the input, even when the user submits before the email input's debounce has applied the edit.

#### Scenario: Submit right after typing
- **WHEN** the user types a new email address and submits within the debounce window
- **THEN** the form submits the new address, not the previous one

### Requirement: Interface text is English
All visible text on the login and register forms, including the footer links between them, SHALL be in English.

#### Scenario: Login footer
- **WHEN** a visitor opens the login page
- **THEN** the footer reads "Don't have an account?" followed by a "Register" link to the register page

#### Scenario: Register footer
- **WHEN** a visitor opens the register page
- **THEN** the footer reads "Already have an account?" followed by a "Sign in" link to the login page
