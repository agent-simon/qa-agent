import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly pageTitle: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.pageTitle = page.locator('h2');
    this.flashMessage = page.locator('#flash');
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async getFlashMessage() {
    return await this.flashMessage.textContent();
  }

  async isUsernameInputVisible() {
    return await this.usernameInput.isVisible();
  }

  async isPasswordInputVisible() {
    return await this.passwordInput.isVisible();
  }

  async isLoginButtonVisible() {
    return await this.loginButton.isVisible();
  }
}
