# Design

## Context

See proposal.md. Measured on a cold start: the Firestore emulator (port 8080, the only port Playwright waits on) accepts connections after about 3.5 s, the Auth emulator (port 9099) after about 6.7 s. Playwright starts its web servers one after the other, so the Angular dev server usually hides the gap, but not when it is ready quickly or reused. The alfabet failure reproduces deterministically when the dev server is already running and the emulators start cold (5 of 5 tests fail with `ECONNREFUSED` on 9099). The CI popup timeout could not be reproduced (40 repeats were green), so that change removes a weak spot rather than fixing a confirmed cause.

## Goals / Non-Goals

**Goals:**
- No test starts before both emulators are reachable.
- The popup test does not depend on Playwright's own timer round trip.
- A flaky failure leaves a trace.

**Non-Goals:**
- Changing worker counts or making tests serial.
- Fixing the root cause of the CI popup timeout, which is unknown.

## Decisions

- **Readiness in a `globalSetup` that polls both ports.** `webServer` accepts one `url` per entry, so a second check cannot be expressed there. Playwright runs `globalSetup` after the web servers are up, so polling `127.0.0.1:9099` and `127.0.0.1:8080` with a TCP connect (30 s limit, clear error) closes the gap. Alternative: point `url` at the Auth emulator; that would leave Firestore unchecked and depend on the start order.
- **Wait for the popup to close, then settle inside the page.** The first idea was to wait for the "Login with Google failed" error. Measured: it did not appear in 24 of 30 runs, because Firebase does not always reject the sign-in when the popup is closed. There is no outcome to wait for, since the test checks that nothing navigates. So the test asserts the popup is closed (`expect.poll`) and then lets the page run a 500 ms timer itself. The CI hang was in `page.waitForTimeout`; whether this avoids it is unproven.
- **`retries: 1` only in CI.** Locally a retry would hide flakes. `trace: 'on-first-retry'` then records the data we lacked.

## Risks / Trade-offs

- [A retry masks a real intermittent bug] → Playwright reports retried tests as "flaky" in the output, and the trace is uploaded by the existing `playwright-test-results` artifact step.
- [The popup change may not cure the CI timeout] → With retries and traces on in CI, the next occurrence is reported as flaky and comes with a trace.
