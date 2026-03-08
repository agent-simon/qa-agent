import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly googleButton: Locator;
  readonly smeButton: Locator;
  readonly showPasswordButton: Locator;
  readonly pageHeading: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('#login_login_buttonText');
    this.googleButton = page.locator('button:has-text("Continue with Google")');
    this.smeButton = page.locator('button:has-text("Continue with SME O365")');
    this.showPasswordButton = page.locator('button:has-text("Show password")');
    this.pageHeading = page.locator('h1:has-text("Login to The Orchard")');
    this.loginForm = page.locator('form');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async enterUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async clickGoogleButton() {
    await this.googleButton.click();
  }

  async clickSMEButton() {
    await this.smeButton.click();
  }

  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  async isPasswordVisible() {
    return await this.passwordField.getAttribute('type') === 'text';
  }

  async getPasswordFieldType() {
    return await this.passwordField.getAttribute('type');
  }

  async getUsernameValue() {
    return await this.usernameField.inputValue();
  }

  async getPasswordValue() {
    return await this.passwordField.inputValue();
  }

  async waitForPageLoad() {
    await this.pageHeading.waitFor({ state: 'visible' });
    await this.loginForm.waitFor({ state: 'visible' });
  }
}
