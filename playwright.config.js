const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = {
  projects: [
    {
      name: 'smoke-tests',
      testMatch: '**/tests/*.spec.js',
      use: {
        ...devices['Chromium'],
        baseURL: process.env.BASE_URL,
        headless: false,
      },
    },
  ],
};
