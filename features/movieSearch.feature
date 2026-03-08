Feature: Movie Search Application

  Scenario: Mobile search functionality
    Given I am on the movie search page
    When I enter "Inception" in the mobile search input
    Then the mobile search input should contain "Inception"

  Scenario: Desktop search functionality
    Given I am on the movie search page
    When I enter "Avatar" in the desktop search input
    Then the desktop search input should contain "Avatar"

  Scenario: Theme toggle functionality
    Given I am on the movie search page
    When I click the theme toggle button
    Then the theme should change

  Scenario: Track toggle functionality
    Given I am on the movie search page
    When I toggle the mobile track checkbox
    Then the mobile track checkbox should be checked
