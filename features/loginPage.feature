Feature: Login Page Smoke Test
  As a user
  I want to access the login page
  So that I can authenticate into the application

  Background:
    Given I navigate to the login page

  Scenario: Login page loads successfully
    Then I should see the login page title "Login Page"
    And I should see the username input field
    And I should see the password input field
    And I should see the login button

  Scenario: Successful login with valid credentials
    When I enter "tomsmith" in the username field
    And I enter "SuperSecretPassword!" in the password field
    And I click the login button
    Then I should be redirected to the secure area
    And I should see a success message

  Scenario: Login fails with invalid credentials
    When I enter "invaliduser" in the username field
    And I enter "wrongpassword" in the password field
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  Scenario: Login fails with empty credentials
    When I leave the username field empty
    And I leave the password field empty
    And I click the login button
    Then I should see an error message
    And I should remain on the login page
