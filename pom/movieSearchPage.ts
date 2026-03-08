import { Page, Locator } from '@playwright/test';

export class MovieSearchPage {
  readonly page: Page;
  readonly mobileSearchInput: Locator;
  readonly desktopSearchInput: Locator;
  readonly mobileTrackToggle: Locator;
  readonly desktopTrackToggle: Locator;
  readonly sunThemeButton: Locator;
  readonly moonThemeButton: Locator;
  readonly searchForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileSearchInput = page.locator('#search-input-mobile');
    this.desktopSearchInput = page.locator('#search-input-desktop');
    this.mobileTrackToggle = page.locator('#toggle-track-mobile');
    this.desktopTrackToggle = page.locator('#toggle-track-desktop');
    this.sunThemeButton = page.getByRole('button', { name: '☀' });
    this.moonThemeButton = page.getByRole('button', { name: '☾' });
    this.searchForm = page.locator('form[action*="playwright-movies-app"]');
  }

  async goto() {
    await this.page.goto('https://debs-obrien.github.io/playwright-movies-app/');
  }

  async searchInMobile(query: string) {
    await this.mobileSearchInput.fill(query);
  }

  async searchInDesktop(query: string) {
    await this.desktopSearchInput.fill(query);
  }

  async toggleMobileTrack() {
    await this.mobileTrackToggle.check();
  }

  async toggleDesktopTrack() {
    await this.desktopTrackToggle.check();
  }

  async clickSunTheme() {
    await this.sunThemeButton.click();
  }

  async clickMoonTheme() {
    await this.moonThemeButton.click();
  }

  async isMobileSearchInputVisible() {
    return await this.mobileSearchInput.isVisible();
  }

  async isDesktopSearchInputVisible() {
    return await this.desktopSearchInput.isVisible();
  }

  async getMobileSearchValue() {
    return await this.mobileSearchInput.inputValue();
  }

  async getDesktopSearchValue() {
    return await this.desktopSearchInput.inputValue();
  }

  async isMobileTrackChecked() {
    return await this.mobileTrackToggle.isChecked();
  }

  async isDesktopTrackChecked() {
    return await this.desktopTrackToggle.isChecked();
  }
}
