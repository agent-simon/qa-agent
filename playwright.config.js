const { defineConfig, devices } = require('@playwright/test');

module.exports = {
  // ... existing config
  projects: [
    {
      name: 'smoke-tests',
      testMatch: '**/tests/*.spec.js',
      use: {
        ...devices['Chromium'],
        baseURL: 'https://the-internet.herokuapp.com',
      },
    },
  ],
};
