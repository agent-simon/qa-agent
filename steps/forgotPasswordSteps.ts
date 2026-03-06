import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pom/forgotPasswordPage';
import { page } from './hooks';

let forgotPasswordPage: ForgotPasswordPage;

Given('I navigate to the forgot password page', async () => {
  forgotPasswordPage = new ForgotPasswordPage(page);
  await forgotPasswordPage.navigateToPage();
  await forgotPasswordPage.isPageLoaded();
});

Then('I should see the {string} heading', async (expectedHeading: string) => {
  const headingText = await forgotPasswordPage.pageHeading.textContent();
  expect(headingText?.trim()).toBe(expectedHeading);
});

Then('I should see the email input field', async () => {
  await expect(forgotPasswordPage.emailInput).toBeVisible();
  await expect(forgotPasswordPage.emailInput).toHaveAttribute('type', 'text');
  await expect(forgotPasswordPage.emailInput).toHaveAttribute('name', 'email');
});

Then('I should see the {string} button', async (buttonText: string) => {
  await expect(forgotPasswordPage.retrievePasswordButton).toBeVisible();
  const actualButtonText = await forgotPasswordPage.retrievePasswordButton.textContent();
  expect(actualButtonText?.trim()).toBe(buttonText);
});

When('I enter a valid email {string}', async (email: string) => {
  await forgotPasswordPage.enterEmail(email);
});

When('I enter an invalid email {string}', async (email: string) => {
  await forgotPasswordPage.enterEmail(email);
});

When('I leave the email field empty', async () => {
  await forgotPasswordPage.enterEmail('');
});

When('I enter text {string} in the email field', async (text: string) => {
  await forgotPasswordPage.enterEmail(text);
});

When('I click the {string} button', async (buttonText: string) => {
  await forgotPasswordPage.clickRetrievePassword();
});

Then('I should see a success message', async () => {
  const flashMessage = await forgotPasswordPage.getFlashMessage();
  expect(flashMessage.toLowerCase()).toContain('sent');
});

Then('I should see an error or validation message', async () => {
  const hasError = await forgotPasswordPage.hasValidationError();
  expect(hasError).toBeTruthy();
});

Then('the email field should contain {string}', async (expectedValue: string) => {
  const actualValue = await forgotPasswordPage.getEmailValue();
  expect(actualValue).toBe(expectedValue);
});
