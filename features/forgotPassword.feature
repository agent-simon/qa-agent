Feature: Forgot Password Functionality
  As a user who has forgotten their password
  I want to be able to request a password reset
  So that I can regain access to my account

  Background:
    Given I navigate to the forgot password page

  Scenario: Page elements are displayed correctly
    Then I should see the "Forgot Password" heading
    And I should see the email input field
    And I should see the "Retrieve password" button

  Scenario: Submit password reset with valid email
    When I enter a valid email "test@example.com"
    And I click the "Retrieve password" button
    Then I should see a success message

  Scenario: Submit password reset with invalid email format
    When I enter an invalid email "invalid-email"
    And I click the "Retrieve password" button
    Then I should see an error or validation message

  Scenario: Submit password reset with empty email
    When I leave the email field empty
    And I click the "Retrieve password" button
    Then I should see an error or validation message

  Scenario: Email field accepts text input
    When I enter text "user@domain.com" in the email field
    Then the email field should contain "user@domain.com"
