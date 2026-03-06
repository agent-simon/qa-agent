import { Page, Locator } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly retrievePasswordButton: Locator;
  readonly pageHeading: Locator;
  readonly form: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.retrievePasswordButton = page.locator('#form_submit');
    this.pageHeading = page.locator('h2');
    this.form = page.locator('#forgot_password');
    this.flashMessage = page.locator('#flash');
  }

  async navigateToPage(): Promise<void> {
    await this.page.goto('https://the-internet.herokuapp.com/forgot_password');
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickRetrievePassword(): Promise<void> {
    await this.retrievePasswordButton.click();
  }

  async submitPasswordReset(email: string): Promise<void> {
    await this.enterEmail(email);
    await this.clickRetrievePassword();
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async isPageLoaded(): Promise<boolean> {
    await this.pageHeading.waitFor({ state: 'visible' });
    await this.emailInput.waitFor({ state: 'visible' });
    await this.retrievePasswordButton.waitFor({ state: 'visible' });
    return true;
  }

  async getFlashMessage(): Promise<string> {
    await this.flashMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.flashMessage.textContent() || '';
  }

  async hasValidationError(): Promise<boolean> {
    // Check for HTML5 validation or flash messages
    const validationMessage = await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    const hasFlashMessage = await this.flashMessage.isVisible().catch(() => false);
    return validationMessage !== '' || hasFlashMessage;
  }
}
