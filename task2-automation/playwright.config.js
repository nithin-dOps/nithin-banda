// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Environment variables
const isCI = process.env.CI === 'true';
const baseURL = process.env.BASE_URL || 'https://goodbudget.com';

// Main configuration
module.exports = defineConfig({
  // Test directory
  testDir: './tests',
  
  // Global test timeout
  timeout: 30000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,
  
  // Retry on CI only
  retries: isCI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: isCI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: baseURL,
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Enable video recording for failed tests
    video: 'on-first-retry',
    
    // Enable screenshot on failure
    screenshot: 'only-on-failure',
    
    // Enable trace collection for failed tests
    trace: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Global setup file
  globalSetup: './tests/setup/global-setup.js',
  
  // Output directory for test artifacts
  outputDir: 'test-results/artifacts',
  
  // Web server configuration (disabled in CI)
  webServer: !isCI ? {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: true,
  } : undefined,
});
