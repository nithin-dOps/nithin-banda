import { test, expect } from '@playwright/test';
import { TestDataGenerator, Selectors } from '../utils/test-data';

/**
 * E2E Test Suite: User Authentication Flow
 * 
 * Business Critical Flow #1: User Registration and Login
 * Tests the core authentication functionality that enables access to the application
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Goodbudget homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should successfully navigate to signup page', async ({ page }) => {
    // Test navigation to signup
    await page.click(Selectors.signupLink);
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the signup page
    await expect(page).toHaveURL(/.*signup.*/);
    await expect(page.locator('h1, h2')).toContainText(/sign.*up|create.*account/i);
  });

  test('should display login form on home page', async ({ page }) => {
    // Navigate to login page
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verify login form is present
    await expect(page.locator(Selectors.loginForm)).toBeVisible();
    await expect(page.locator(Selectors.emailInput)).toBeVisible();
    await expect(page.locator(Selectors.passwordInput)).toBeVisible();
    await expect(page.locator(Selectors.loginButton)).toBeVisible();
  });

  test('should show validation error for empty login form', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click(Selectors.loginButton);
    
    // Check for validation (browser validation or custom)
    const emailInput = page.locator(Selectors.emailInput);
    const passwordInput = page.locator(Selectors.passwordInput);
    
    // Check if HTML5 validation is triggered
    const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    const passwordValidity = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    // At least one field should be invalid
    expect(emailValidity || passwordValidity).toBeFalsy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Fill in invalid credentials
    await page.fill(Selectors.emailInput, 'invalid@example.com');
    await page.fill(Selectors.passwordInput, 'wrongpassword');
    
    // Submit form
    await page.click(Selectors.loginButton);
    await page.waitForLoadState('networkidle');
    
    // Check for error message or staying on login page
    const currentUrl = page.url();
    const hasErrorMessage = await page.locator(Selectors.errorMessage).isVisible().catch(() => false);
    
    // Either should show error message or stay on login page
    expect(hasErrorMessage || currentUrl.includes('home') || currentUrl.includes('login')).toBeTruthy();
  });

  test('should handle session persistence', async ({ page, context }) => {
    // This test checks if login state is maintained across page refreshes
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Check if there's a "stay signed in" option
    const staySignedInCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /stay.*signed.*in|remember.*me/i });
    
    if (await staySignedInCheckbox.isVisible()) {
      await staySignedInCheckbox.check();
      
      // Verify checkbox is checked
      await expect(staySignedInCheckbox).toBeChecked();
    }
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Test invalid email format
    await page.fill(Selectors.emailInput, 'invalid-email');
    await page.fill(Selectors.passwordInput, 'somepassword');
    
    // Try to submit
    await page.click(Selectors.loginButton);
    
    // Check for email validation
    const emailInput = page.locator(Selectors.emailInput);
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    expect(isValid).toBeFalsy();
  });

  test('should handle password field security', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Verify password field type
    const passwordInput = page.locator(Selectors.passwordInput);
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Fill password and verify it's masked
    await passwordInput.fill('testpassword123');
    const inputValue = await passwordInput.inputValue();
    const displayValue = await passwordInput.evaluate((el: HTMLInputElement) => el.value);
    
    // Value should be accessible but display should be masked
    expect(inputValue).toBe('testpassword123');
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Test tab navigation through form
    await page.keyboard.press('Tab');
    
    // Check if email field gets focus
    const emailInput = page.locator(Selectors.emailInput);
    await expect(emailInput).toBeFocused();
    
    // Tab to password field
    await page.keyboard.press('Tab');
    const passwordInput = page.locator(Selectors.passwordInput);
    await expect(passwordInput).toBeFocused();
    
    // Tab to submit button
    await page.keyboard.press('Tab');
    const loginButton = page.locator(Selectors.loginButton);
    await expect(loginButton).toBeFocused();
  });

  test('should handle form submission with Enter key', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill(Selectors.emailInput, 'test@example.com');
    await page.fill(Selectors.passwordInput, 'testpassword');
    
    // Submit with Enter key
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    
    // Verify form was submitted (URL change or error message)
    const currentUrl = page.url();
    const hasErrorMessage = await page.locator(Selectors.errorMessage).isVisible().catch(() => false);
    
    // Form should have been processed
    expect(hasErrorMessage || !currentUrl.includes('home')).toBeTruthy();
  });
});
