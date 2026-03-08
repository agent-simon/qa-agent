Feature: Login Page

  Background:
    Given I am on the login page

  Scenario: Page loads with all required elements
    Then I should see the login form
    And I should see the username field
    And I should see the password field
    And I should see the "LOG IN" button
    And I should see the "Continue with Google" button
    And I should see the "Continue with SME O365" button
    And I should see the page heading "Login to The Orchard"

  Scenario: Password visibility toggle functionality
    When I enter a password
    And I click the show password button
    Then the password should be visible
    When I click the hide password button
    Then the password should be hidden

  Scenario: Form validation for empty fields
    When I click the "LOG IN" button without entering credentials
    Then I should see validation errors

  Scenario: Username field accepts input
    When I enter "testuser" in the username field
    Then the username field should contain "testuser"

  Scenario: Password field accepts input
    When I enter "testpassword" in the password field
    Then the password field should contain the entered password

  Scenario: Login attempt with credentials
    When I enter "testuser" in the username field
    And I enter "testpassword" in the password field
    And I click the "LOG IN" button
    Then the login form should be submitted

  Scenario: Google login button is functional
    When I click the "Continue with Google" button
    Then I should be redirected to Google authentication

  Scenario: SME O365 login button is functional
    When I click the "Continue with SME O365" button
    Then I should be redirected to O365 authentication
