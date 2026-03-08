import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MovieSearchPage } from '../pom/movieSearchPage';

Given('I am on the movie search page', async function () {
  this.movieSearchPage = new MovieSearchPage(this.page);
  await this.movieSearchPage.goto();
});

When('I enter {string} in the mobile search input', async function (searchTerm: string) {
  await this.movieSearchPage.searchInMobile(searchTerm);
});

When('I enter {string} in the desktop search input', async function (searchTerm: string) {
  await this.movieSearchPage.searchInDesktop(searchTerm);
});

When('I click the theme toggle button', async function () {
  await this.movieSearchPage.clickSunTheme();
});

When('I toggle the mobile track checkbox', async function () {
  await this.movieSearchPage.toggleMobileTrack();
});

Then('the mobile search input should contain {string}', async function (expectedValue: string) {
  const actualValue = await this.movieSearchPage.getMobileSearchValue();
  expect(actualValue).toBe(expectedValue);
});

Then('the desktop search input should contain {string}', async function (expectedValue: string) {
  const actualValue = await this.movieSearchPage.getDesktopSearchValue();
  expect(actualValue).toBe(expectedValue);
});

Then('the theme should change', async function () {
  // Verify that theme toggle buttons are still visible after click
  await expect(this.movieSearchPage.sunThemeButton).toBeVisible();
  await expect(this.movieSearchPage.moonThemeButton).toBeVisible();
});

Then('the mobile track checkbox should be checked', async function () {
  const isChecked = await this.movieSearchPage.isMobileTrackChecked();
  expect(isChecked).toBe(true);
});
