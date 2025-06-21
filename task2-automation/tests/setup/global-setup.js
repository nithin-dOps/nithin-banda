const { chromium } = require('@playwright/test');

module.exports = async (config) => {
  const { baseURL, storageState } = config.projects[0].use;
  
  // Launch browser and create a new context
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Any global setup logic can go here
    console.log('Global setup completed');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    // Clean up
    await context.close();
    await browser.close();
  }
};
