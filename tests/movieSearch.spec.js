import { test, expect } from '@playwright/test';

test.describe('Movie Search Application Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://debs-obrien.github.io/playwright-movies-app/');
  });

  test('should display mobile search input', async ({ page }) => {
    const mobileSearchInput = page.locator('#search-input-mobile');
    await expect(mobileSearchInput).toBeVisible();
    await expect(mobileSearchInput).toHaveAttribute('placeholder', 'Search for a movie...');
  });

  test('should display desktop search input', async ({ page }) => {
    const desktopSearchInput = page.locator('#search-input-desktop');
    await expect(desktopSearchInput).toBeVisible();
    await expect(desktopSearchInput).toHaveAttribute('placeholder', 'Search for a movie...');
  });

  test('should allow typing in mobile search input', async ({ page }) => {
    const mobileSearchInput = page.locator('#search-input-mobile');
    await mobileSearchInput.fill('Inception');
    await expect(mobileSearchInput).toHaveValue('Inception');
  });

  test('should allow typing in desktop search input', async ({ page }) => {
    const desktopSearchInput = page.locator('#search-input-desktop');
    await desktopSearchInput.fill('Avatar');
    await expect(desktopSearchInput).toHaveValue('Avatar');
  });

  test('should display theme toggle buttons', async ({ page }) => {
    const sunButton = page.getByRole('button', { name: '☀' });
    const moonButton = page.getByRole('button', { name: '☾' });
    
    await expect(sunButton).toBeVisible();
    await expect(moonButton).toBeVisible();
  });

  test('should allow clicking theme toggle buttons', async ({ page }) => {
    const sunButton = page.getByRole('button', { name: '☀' });
    const moonButton = page.getByRole('button', { name: '☾' });
    
    await sunButton.click();
    await moonButton.click();
    
    // Verify buttons are still clickable after theme changes
    await expect(sunButton).toBeVisible();
    await expect(moonButton).toBeVisible();
  });

  test('should display track toggle checkboxes', async ({ page }) => {
    const mobileTrackToggle = page.locator('#toggle-track-mobile');
    const desktopTrackToggle = page.locator('#toggle-track-desktop');
    
    await expect(mobileTrackToggle).toBeVisible();
    await expect(desktopTrackToggle).toBeVisible();
  });

  test('should allow toggling mobile track checkbox', async ({ page }) => {
    const mobileTrackToggle = page.locator('#toggle-track-mobile');
    
    await mobileTrackToggle.check();
    await expect(mobileTrackToggle).toBeChecked();
    
    await mobileTrackToggle.uncheck();
    await expect(mobileTrackToggle).not.toBeChecked();
  });

  test('should allow toggling desktop track checkbox', async ({ page }) => {
    const desktopTrackToggle = page.locator('#toggle-track-desktop');
    
    await desktopTrackToggle.check();
    await expect(desktopTrackToggle).toBeChecked();
    
    await desktopTrackToggle.uncheck();
    await expect(desktopTrackToggle).not.toBeChecked();
  });

  test('should display search form', async ({ page }) => {
    const searchForm = page.locator('form[action*="playwright-movies-app"]');
    await expect(searchForm).toBeVisible();
  });
});
