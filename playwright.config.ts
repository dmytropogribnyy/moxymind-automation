import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const reqresHeaders = {
  'Content-Type': 'application/json',
  ...(process.env.REQRES_API_KEY
    ? { 'x-api-key': process.env.REQRES_API_KEY }
    : {}),
};

export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html'], ['list']]
    : [['html'], ['list']],

  projects: [
    {
      name: 'frontend',
      testDir: './tests/frontend',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        testIdAttribute: 'data-test',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://reqres.in',
        extraHTTPHeaders: reqresHeaders,
      },
    },
  ],
});
