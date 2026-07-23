import { defineConfig, devices } from '@playwright/test';
import { environment } from './config/environment';

const reqresHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

if (environment.reqresApiKey) {
  reqresHeaders['x-api-key'] = environment.reqresApiKey;
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  outputDir: 'test-results',
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
      ]
    : [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
      ],
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: environment.sauceDemoBaseUrl,
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
        baseURL: environment.reqresBaseUrl,
        extraHTTPHeaders: reqresHeaders,
      },
    },
  ],
});
