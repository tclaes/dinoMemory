# Tasks

## 1. Wait for both emulators

- [x] 1.1 Add `e2e/global-setup.ts` that waits for ports 9099 and 8080 and register it in `playwright.config.ts`; fix the comment on the Firestore `url`; verify with `npm run e2e` (all tests green)
- [x] 1.2 Verify the setup waits for Auth: run the e2e suite against an already running dev server (`reuseExistingServer`) and confirm no `ECONNREFUSED` on 9099

## 2. Remove the fixed sleep

- [x] 2.1 In `e2e/login.spec.ts`, wait for the popup to be closed and run the 500 ms settle in the page instead of `page.waitForTimeout`; verify with `npm run e2e -- login.spec.ts --repeat-each=30`

## 3. Record traces for flakes

- [ ] 3.1 Set `retries: process.env['CI'] ? 1 : 0` in `playwright.config.ts`; verify with `npm run e2e` locally (no retries) and by checking the config in the CI run on the PR
