import { test, expect } from '@playwright/test';

test.describe('Login Page Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
  });

  test('should load login page elements successfully', async ({ page }) => {
    // Given I am on the login page
    // When the page loads
    // Then I should see all required elements
    
    await expect(page.locator('h2')).toHaveText('Login Page');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(/Login/);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Given I am on the login page
    // When I enter valid credentials
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // And I click login
    await page.locator('button[type="submit"]').click();
    
    // Then I should be redirected to secure area
    await expect(page).toHaveURL(/.*\/secure/);
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });

  test('should show error message with invalid username', async ({ page }) => {
    // Given I am on the login page
    // When I enter invalid username
    await page.locator('#username').fill('invaliduser');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // And I click login
    await page.locator('button[type="submit"]').click();
    
    // Then I should see error message
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show error message with invalid password', async ({ page }) => {
    // Given I am on the login page
    // When I enter invalid password
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('wrongpassword');
    
    // And I click login
    await page.locator('button[type="submit"]').click();
    
    // Then I should see error message
    await expect(page.locator('#flash')).toContainText('Your password is invalid!');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show error message with empty credentials', async ({ page }) => {
    // Given I am on the login page
    // When I submit without entering credentials
    await page.locator('button[type="submit"]').click();
    
    // Then I should see error message
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should have proper form attributes', async ({ page }) => {
    // Given I am on the login page
    // Then the form should have correct attributes
    const form = page.locator('#login');
    await expect(form).toHaveAttribute('action', 'https://the-internet.herokuapp.com/authenticate');
    
    // And input fields should have correct attributes
    await expect(page.locator('#username')).toHaveAttribute('type', 'text');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });
});
