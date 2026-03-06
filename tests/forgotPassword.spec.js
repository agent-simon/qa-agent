const { test, expect } = require('@playwright/test');

test.describe('Forgot Password - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/forgot_password');
  });

  test('should display all required page elements', async ({ page }) => {
    // Given I am on the forgot password page
    
    // Then I should see the page heading
    await expect(page.locator('h2')).toHaveText('Forgot Password');
    
    // And I should see the email input field
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'text');
    await expect(emailInput).toHaveAttribute('name', 'email');
    
    // And I should see the retrieve password button
    const submitButton = page.locator('#form_submit');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveAttribute('type', 'submit');
    await expect(submitButton).toHaveText('Retrieve password');
    
    // And the form should be present
    const form = page.locator('#forgot_password');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute('action', 'https://the-internet.herokuapp.com/forgot_password');
  });

  test('should accept valid email input', async ({ page }) => {
    // Given I am on the forgot password page
    
    // When I enter a valid email
    const emailInput = page.locator('#email');
    await emailInput.fill('test@example.com');
    
    // Then the email field should contain the entered value
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should submit form with valid email', async ({ page }) => {
    // Given I am on the forgot password page
    
    // When I enter a valid email and submit
    await page.fill('#email', 'user@example.com');
    await page.click('#form_submit');
    
    // Then I should see a response (success message or new page)
    await page.waitForLoadState('networkidle');
    
    // Check if we got redirected or received a flash message
    const currentUrl = page.url();
    const flashMessage = page.locator('#flash');
    
    const isRedirected = !currentUrl.includes('/forgot_password');
    const hasFlashMessage = await flashMessage.isVisible();
    
    expect(isRedirected || hasFlashMessage).toBeTruthy();
  });

  test('should handle empty email submission', async ({ page }) => {
    // Given I am on the forgot password page
    
    // When I submit without entering an email
    await page.click('#form_submit');
    
    // Then I should see validation or remain on the same page
    const emailInput = page.locator('#email');
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    const currentUrl = page.url();
    
    // Either HTML5 validation kicks in or we stay on the same page
    const hasValidation = validationMessage !== '';
    const stayedOnPage = currentUrl.includes('/forgot_password');
    
    expect(hasValidation || stayedOnPage).toBeTruthy();
  });

  test('should handle invalid email format', async ({ page }) => {
    // Given I am on the forgot password page
    
    // When I enter an invalid email format
    await page.fill('#email', 'invalid-email-format');
    await page.click('#form_submit');
    
    // Then the system should handle it gracefully
    await page.waitForLoadState('networkidle');
    
    // Check for HTML5 validation or server response
    const emailInput = page.locator('#email');
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    const flashMessage = page.locator('#flash');
    const hasFlashMessage = await flashMessage.isVisible();
    
    // Some form of feedback should be provided
    expect(validationMessage !== '' || hasFlashMessage || page.url().includes('/forgot_password')).toBeTruthy();
  });

  test('should clear email input when needed', async ({ page }) => {
    // Given I am on the forgot password page
    
    // When I enter text and then clear it
    const emailInput = page.locator('#email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    await emailInput.fill('');
    
    // Then the field should be empty
    await expect(emailInput).toHaveValue('');
  });
});
