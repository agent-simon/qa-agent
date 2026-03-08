import { test, expect } from '@playwright/test';

test.describe('Login Page Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('h1:has-text("Login to The Orchard")');
  });

  test('should load login page with all essential elements', async ({ page }) => {
    // Check page heading
    await expect(page.locator('h1:has-text("Login to The Orchard")')).toBeVisible();
    
    // Check form fields
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    
    // Check buttons
    await expect(page.locator('button:has-text("LOG IN")')).toBeVisible();

    // Check password toggle switch
    await expect(page.locator('[role="switch"][aria-label="Show password"]')).toBeVisible();
  });

  test('should allow input in username field', async ({ page }) => {
    const usernameField = page.locator('#username');
    await usernameField.fill('testuser@example.com');
    await expect(usernameField).toHaveValue('testuser@example.com');
  });

  test('should allow input in password field', async ({ page }) => {
    const passwordField = page.locator('#password');
    await passwordField.fill('testpassword123');
    await expect(passwordField).toHaveValue('testpassword123');
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordField = page.locator('#password');
    const toggleButton = page.locator('[role="switch"][aria-label="Show password"]');
    
    // Enter password
    await passwordField.fill('testpassword123');
    
    // Check initial state (hidden)
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Show password
    await toggleButton.click();
    await expect(passwordField).toHaveAttribute('type', 'text');
    
    // Hide password again
    const hideButton = page.locator('[role="switch"][aria-label="Hide password"]');
    await hideButton.click();
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should submit form when login button is clicked', async ({ page }) => {
    const usernameField = page.locator('#username');
    const passwordField = page.locator('#password');
    const loginButton = page.locator('button:has-text("LOG IN")');
    
    // Fill credentials
    await usernameField.fill('testuser@example.com');
    await passwordField.fill('testpassword123');
    
    // Click login button
    await loginButton.click();
    
    // Wait for form submission (network activity)
    await page.waitForLoadState('networkidle');
  });

  test('should have proper form action URL', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toHaveAttribute('action', /login\.distroauth\.com/);
  });

  test('should focus on username field when tab is pressed', async ({ page }) => {
    await page.keyboard.press('Tab');
    const usernameField = page.locator('#password');
    await expect(usernameField).toBeFocused();
  });

  test('should navigate to password field when tab is pressed from username', async ({ page }) => {
    const usernameField = page.locator('#username');
    const passwordField = page.locator('#password');
    
    await usernameField.click();
    await page.keyboard.press('Tab');
    await expect(passwordField).toBeFocused();
  });
});
