import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npx firebase-tools emulators:start --only auth,firestore --project dinomemory-10d97',
      // Firestore is the last emulator to come up; if only Auth is running this is not reused and the start fails loudly.
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
