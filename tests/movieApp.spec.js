import { test, expect } from '@playwright/test';

test.describe('Movie App Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://debs-obrien.github.io/playwright-movies-app/');
  });

  test('should load the movie app page successfully', async ({ page }) => {
    // Verify essential elements are present
    await expect(page.locator('#search-input-mobile')).toBeVisible();
    await expect(page.locator('#search-input-desktop')).toBeVisible();
    await expect(page.locator('#toggle-track-mobile')).toBeVisible();
    await expect(page.locator('#toggle-track-desktop')).toBeVisible();
  });

  test('should have functional mobile search input', async ({ page }) => {
    const mobileSearch = page.locator('#search-input-mobile');
    await expect(mobileSearch).toHaveAttribute('placeholder', 'Search for a movie...');
    await mobileSearch.fill('Inception');
    await expect(mobileSearch).toHaveValue('Inception');
  });

  test('should have functional desktop search input', async ({ page }) => {
    const desktopSearch = page.locator('#search-input-desktop');
    await expect(desktopSearch).toHaveAttribute('placeholder', 'Search for a movie...');
    await desktopSearch.fill('Avatar');
    await expect(desktopSearch).toHaveValue('Avatar');
  });

  test('should have clickable theme toggle buttons', async ({ page }) => {
    const sunButtons = page.locator('button').filter({ hasText: '☀' });
    const moonButtons = page.locator('button').filter({ hasText: '☾' });
    
    await expect(sunButtons.first()).toBeVisible();
    await expect(moonButtons.first()).toBeVisible();
    
    // Verify buttons are clickable
    await sunButtons.first().click();
    await moonButtons.first().click();
  });

  test('should have functional tracking toggles', async ({ page }) => {
    const mobileToggle = page.locator('#toggle-track-mobile');
    const desktopToggle = page.locator('#toggle-track-desktop');
    
    // Test mobile toggle
    const initialMobileState = await mobileToggle.isChecked();
    await mobileToggle.click();
    const newMobileState = await mobileToggle.isChecked();
    expect(newMobileState).not.toBe(initialMobileState);
    
    // Test desktop toggle  
    const initialDesktopState = await desktopToggle.isChecked();
    await desktopToggle.click();
    const newDesktopState = await desktopToggle.isChecked();
    expect(newDesktopState).not.toBe(initialDesktopState);
  });

  test('should have properly configured forms', async ({ page }) => {
    const forms = page.locator('form');
    await expect(forms.first()).toHaveAttribute('action', 'https://debs-obrien.github.io/playwright-movies-app/?category=Popular&page=1');
    await expect(forms.last()).toHaveAttribute('action', 'https://debs-obrien.github.io/playwright-movies-app/?category=Popular&page=1');
  });

  test('should handle search submission without errors', async ({ page }) => {
    const mobileSearch = page.locator('#search-input-mobile');
    await mobileSearch.fill('Test Movie');
    await mobileSearch.press('Enter');
    
    // Verify page doesn't crash and URL changes appropriately
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('debs-obrien.github.io/playwright-movies-app');
  });
});
