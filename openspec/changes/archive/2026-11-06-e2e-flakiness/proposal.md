# Proposal

## Why

Two e2e tests failed without a code change: the alfabet tests with `ECONNREFUSED 127.0.0.1:9099` (local run) and the Google popup login test with a 30 s timeout (CI, passed on re-run). The e2e setup only waits for the Firestore emulator although the tests also need the Auth emulator, one test relies on a fixed sleep, and no trace is ever recorded for a flaky failure.

## What Changes

- Make the e2e run wait until both the Auth and the Firestore emulators accept connections before any test starts, and correct the misleading comment in `playwright.config.ts`.
- Make the Google popup login test wait until the popup is actually closed and run its short settle inside the page, instead of using `page.waitForTimeout`, which hung in CI.
- Retry a failing e2e test once in CI so traces are recorded (`trace: 'on-first-retry'` has had no effect without retries) and a one-off flake does not fail the pipeline.

## Capabilities

### New Capabilities

### Modified Capabilities

No spec-level behavior changes: this is test tooling only (`skip_specs: true`).

## Impact

- `playwright.config.ts`, a new `e2e/global-setup.ts`, and `e2e/login.spec.ts`.
- No application code, no dependencies.
