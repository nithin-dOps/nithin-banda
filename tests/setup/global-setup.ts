import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Handles authentication and shared state preparation
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Create a browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to Goodbudget
    console.log('📱 Navigating to Goodbudget...');
    await page.goto('https://goodbudget.com');
    
    // Check if the site is accessible
    await page.waitForLoadState('networkidle');
    console.log('✅ Goodbudget site is accessible');
    
    // You can add authentication setup here if needed
    // For example, create a test user session and save it
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;
