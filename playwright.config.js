import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default {
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