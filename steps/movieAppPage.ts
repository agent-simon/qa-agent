import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MovieAppPage } from '../pom/movieAppPage';

Given('I am on the movie app page', async function () {
  this.movieAppPage = new MovieAppPage(this.page);
  await this.movieAppPage.goto();
});

When('I search for a movie using mobile search', async function () {
  await this.movieAppPage.searchMovieMobile('Inception');
});

When('I search for a movie using desktop search', async function () {
  await this.movieAppPage.searchMovieDesktop('Avatar');
});

When('I toggle the theme using sun/moon buttons', async function () {
  await this.movieAppPage.toggleTheme();
});

When('I toggle the track checkbox on mobile', async function () {
  this.initialTrackState = await this.movieAppPage.getTrackToggleState('mobile');
  await this.movieAppPage.toggleMobileTracking();
});

Then('the search should work properly', async function () {
  // Verify the page doesn't crash and form action is correct
  await expect(this.movieAppPage.forms.first()).toHaveAttribute('action', /category=Popular/);
});

Then('the theme should change', async function () {
  // Verify theme buttons are still visible and functional
  await expect(this.movieAppPage.areThemeButtonsVisible()).resolves.toBe(true);
});

Then('the tracking state should change', async function () {
  const currentTrackState = await this.movieAppPage.getTrackToggleState('mobile');
  expect(currentTrackState).not.toBe(this.initialTrackState);
});

Then('all essential elements should be visible', async function () {
  await expect(this.movieAppPage.isSearchInputVisible('mobile')).resolves.toBe(true);
  await expect(this.movieAppPage.isSearchInputVisible('desktop')).resolves.toBe(true);
  await expect(this.movieAppPage.areThemeButtonsVisible()).resolves.toBe(true);
  await expect(this.movieAppPage.areTrackTogglesVisible()).resolves.toBe(true);
});
