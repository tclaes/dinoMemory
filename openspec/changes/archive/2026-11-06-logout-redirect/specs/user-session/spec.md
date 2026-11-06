# Spec Delta

## Purpose

Defines how a signed-in player ends their session and what a signed-out visitor can reach afterwards, so that signing out always leads to the login page.

## ADDED Requirements

### Requirement: Signing out shows the login page
The system SHALL end the player's session when they select the "Bye!" button in the header and SHALL then show the login page, regardless of which page the player was on.

#### Scenario: Sign out from the game
- **WHEN** a signed-in player on the game page selects "Bye!"
- **THEN** the login page is shown
- **AND** the "Bye!" button is no longer visible

#### Scenario: Sign out from the profile page
- **WHEN** a signed-in player on the profile page selects "Bye!"
- **THEN** the login page is shown

### Requirement: Protected pages require a session
After signing out, the system SHALL NOT show the game or the profile page until the visitor signs in again, and SHALL send the visitor to the login page instead.

#### Scenario: Open the game after signing out
- **WHEN** a player has signed out and then opens the game address
- **THEN** the login page is shown

#### Scenario: Open the profile page after signing out
- **WHEN** a player has signed out and then opens the profile page address
- **THEN** the login page is shown
