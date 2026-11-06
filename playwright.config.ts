import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  globalSetup: './e2e/global-setup.ts',
  // A retry in CI records a trace (trace: 'on-first-retry') and reports the test as flaky instead of failing the run.
  retries: process.env['CI'] ? 1 : 0,
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npx firebase-tools emulators:start --only auth,firestore --project dinomemory-10d97',
      // Firestore comes up before Auth, so this only detects a running emulator; e2e/global-setup.ts waits for Auth too.
      // If only Auth is running this is not reused and the start fails loudly.
      url: 'http://127.0.0.1:8080',
      reuseExistingServer: !process.env['CI'],
      timeout: 120 * 1000,
      // SIGTERM lets firebase-tools stop its emulators; the default SIGKILL leaves the Java ones running.
      gracefulShutdown: { signal: 'SIGTERM', timeout: 10 * 1000 },
    },
    {
      command: 'npm start -- --configuration e2e --port 4300',
      url: 'http://localhost:4300',
      reuseExistingServer: !process.env['CI'],
      timeout: 120 * 1000,
    },
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
