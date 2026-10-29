import { defineConfig, devices } from '@playwright/test';

// Set PLAYWRIGHT_PORT to test this checkout on its own port. Another session may already
// be serving a different build on 4321, and reuseExistingServer would silently test that.
const PORT = process.env.PLAYWRIGHT_PORT ?? '4321';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      // System Chrome: avoids the ~500 MB Chromium download (disk is tight
      // on this machine; same approach as scripts/render-ebook-pdf.ts).
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
