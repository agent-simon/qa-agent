import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pom/loginPage';

let loginPage: LoginPage;

Given('I navigate to the login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

Then('I should see the login page title {string}', async function (expectedTitle: string) {
  const actualTitle = await loginPage.getPageTitle();
  expect(actualTitle?.trim()).toBe(expectedTitle);
});

Then('I should see the username input field', async function () {
  expect(await loginPage.isUsernameInputVisible()).toBeTruthy();
});

Then('I should see the password input field', async function () {
  expect(await loginPage.isPasswordInputVisible()).toBeTruthy();
});

Then('I should see the login button', async function () {
  expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
});

When('I enter {string} in the username field', async function (username: string) {
  await loginPage.usernameInput.fill(username);
});

When('I enter {string} in the password field', async function (password: string) {
  await loginPage.passwordInput.fill(password);
});

When('I click the login button', async function () {
  await loginPage.loginButton.click();
});

When('I leave the username field empty', async function () {
  await loginPage.usernameInput.fill('');
});

When('I leave the password field empty', async function () {
  await loginPage.passwordInput.fill('');
});

Then('I should be redirected to the secure area', async function () {
  await expect(this.page).toHaveURL(/.*\/secure/);
});

Then('I should see a success message', async function () {
  const flashMessage = await loginPage.getFlashMessage();
  expect(flashMessage).toContain('You logged into a secure area!');
});

Then('I should see an error message', async function () {
  const flashMessage = await loginPage.getFlashMessage();
  expect(flashMessage).toMatch(/(Your username is invalid!|Your password is invalid!)/);
});

Then('I should remain on the login page', async function () {
  await expect(this.page).toHaveURL(/.*\/login/);
});
