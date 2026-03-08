Feature: Movie App Smoke Test

  Scenario: Verify movie search functionality on mobile
    Given I am on the movie app page
    When I search for a movie using mobile search
    Then the search should work properly

  Scenario: Verify movie search functionality on desktop
    Given I am on the movie app page
    When I search for a movie using desktop search
    Then the search should work properly

  Scenario: Verify theme toggle functionality
    Given I am on the movie app page
    When I toggle the theme using sun/moon buttons
    Then the theme should change

  Scenario: Verify tracking toggle functionality
    Given I am on the movie app page
    When I toggle the track checkbox on mobile
    Then the tracking state should change

  Scenario: Verify page loads correctly
    Given I am on the movie app page
    Then all essential elements should be visible
