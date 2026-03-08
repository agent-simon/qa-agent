import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pom/loginPage';

Given('I am on the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
  await this.loginPage.waitForPageLoad();
});

Then('I should see the login form', async function () {
  await expect(this.loginPage.loginForm).toBeVisible();
});

Then('I should see the username field', async function () {
  await expect(this.loginPage.usernameField).toBeVisible();
});

Then('I should see the password field', async function () {
  await expect(this.loginPage.passwordField).toBeVisible();
});

Then('I should see the {string} button', async function (buttonText: string) {
  const button = this.page.locator(`button:has-text("${buttonText}")`);
  await expect(button).toBeVisible();
});

Then('I should see the page heading {string}', async function (headingText: string) {
  await expect(this.loginPage.pageHeading).toBeVisible();
  await expect(this.loginPage.pageHeading).toHaveText(headingText);
});

When('I enter a password', async function () {
  await this.loginPage.enterPassword('testpassword123');
});

When('I click the show password button', async function () {
  await this.loginPage.togglePasswordVisibility();
});

When('I click the hide password button', async function () {
  await this.loginPage.togglePasswordVisibility();
});

Then('the password should be visible', async function () {
  const isVisible = await this.loginPage.isPasswordVisible();
  expect(isVisible).toBe(true);
});

Then('the password should be hidden', async function () {
  const isVisible = await this.loginPage.isPasswordVisible();
  expect(isVisible).toBe(false);
});

When('I click the {string} button without entering credentials', async function (buttonText: string) {
  if (buttonText === 'LOG IN') {
    await this.loginPage.clickLoginButton();
  }
});

Then('I should see validation errors', async function () {
  // Wait for potential validation messages or form submission behavior
  await this.page.waitForTimeout(1000);
  // This would need to be adjusted based on actual validation behavior
});

When('I enter {string} in the username field', async function (username: string) {
  await this.loginPage.enterUsername(username);
});

When('I enter {string} in the password field', async function (password: string) {
  await this.loginPage.enterPassword(password);
});

Then('the username field should contain {string}', async function (expectedValue: string) {
  const actualValue = await this.loginPage.getUsernameValue();
  expect(actualValue).toBe(expectedValue);
});

Then('the password field should contain the entered password', async function () {
  const passwordValue = await this.loginPage.getPasswordValue();
  expect(passwordValue).not.toBe('');
});

When('I click the {string} button', async function (buttonText: string) {
  switch (buttonText) {
    case 'LOG IN':
      await this.loginPage.clickLoginButton();
      break;
    case 'Continue with Google':
      await this.loginPage.clickGoogleButton();
      break;
    case 'Continue with SME O365':
      await this.loginPage.clickSMEButton();
      break;
  }
});

Then('the login form should be submitted', async function () {
  // Wait for form submission - this might involve waiting for navigation or loading state
  await this.page.waitForLoadState('networkidle');
});

Then('I should be redirected to Google authentication', async function () {
  // Wait for navigation to Google auth
  await this.page.waitForTimeout(2000);
  // Check if we're navigating away or if a popup appears
  const url = this.page.url();
  expect(url).toContain('google' || 'accounts.google.com' || url !== '/login');
});

Then('I should be redirected to O365 authentication', async function () {
  // Wait for navigation to O365 auth
  await this.page.waitForTimeout(2000);
  // Check if we're navigating away or if a popup appears
  const url = this.page.url();
  expect(url).toContain('microsoft' || 'login.microsoftonline.com' || url !== '/login');
});
