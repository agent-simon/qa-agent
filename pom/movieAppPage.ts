import { Page, Locator } from '@playwright/test';

export class MovieAppPage {
  readonly page: Page;
  readonly mobileSearchInput: Locator;
  readonly desktopSearchInput: Locator;
  readonly mobileTrackToggle: Locator;
  readonly desktopTrackToggle: Locator;
  readonly sunButtons: Locator;
  readonly moonButtons: Locator;
  readonly forms: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileSearchInput = page.locator('#search-input-mobile');
    this.desktopSearchInput = page.locator('#search-input-desktop');
    this.mobileTrackToggle = page.locator('#toggle-track-mobile');
    this.desktopTrackToggle = page.locator('#toggle-track-desktop');
    this.sunButtons = page.locator('button').filter({ hasText: '☀' });
    this.moonButtons = page.locator('button').filter({ hasText: '☾' });
    this.forms = page.locator('form');
  }

  async goto() {
    await this.page.goto('https://debs-obrien.github.io/playwright-movies-app/');
  }

  async searchMovieMobile(movieName: string) {
    await this.mobileSearchInput.fill(movieName);
    await this.mobileSearchInput.press('Enter');
  }

  async searchMovieDesktop(movieName: string) {
    await this.desktopSearchInput.fill(movieName);
    await this.desktopSearchInput.press('Enter');
  }

  async toggleTheme() {
    const sunButton = this.sunButtons.first();
    await sunButton.click();
  }

  async toggleMobileTracking() {
    await this.mobileTrackToggle.click();
  }

  async toggleDesktopTracking() {
    await this.desktopTrackToggle.click();
  }

  async isSearchInputVisible(type: 'mobile' | 'desktop'): Promise<boolean> {
    const input = type === 'mobile' ? this.mobileSearchInput : this.desktopSearchInput;
    return await input.isVisible();
  }

  async areThemeButtonsVisible(): Promise<boolean> {
    return await this.sunButtons.first().isVisible();
  }

  async areTrackTogglesVisible(): Promise<boolean> {
    return await this.mobileTrackToggle.isVisible();
  }

  async getTrackToggleState(type: 'mobile' | 'desktop'): Promise<boolean> {
    const toggle = type === 'mobile' ? this.mobileTrackToggle : this.desktopTrackToggle;
    return await toggle.isChecked();
  }
}
