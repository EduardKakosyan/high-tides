import { defineConfig, devices } from '@playwright/test';

// E2E config for the static Astro site. The webServer builds the site and
// serves it with `astro preview` (default port 4321), so tests run against
// the real production output. Run with `npm run test:e2e`.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Mobile viewport (Chromium-based so CI stays one browser install).
      // Real-device iOS checks happen by hand on spike/feature branches.
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
