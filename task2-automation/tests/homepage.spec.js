const { test, expect } = require('@playwright/test');

test.describe('Goodbudget Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify the page title
    await expect(page).toHaveTitle(/Goodbudget/);
    
    // Verify the main heading is visible
    await expect(page.getByRole('heading', { name: /Budget with the envelope system/i })).toBeVisible();
  });

  test('should have sign up and login buttons', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify sign up button is visible
    await expect(page.getByRole('link', { name: /Sign Up/i })).toBeVisible();
    
    // Verify login button is visible
    await expect(page.getByRole('link', { name: /Log In/i })).toBeVisible();
  });
});
