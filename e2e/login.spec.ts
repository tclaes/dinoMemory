import {expect, test} from '@playwright/test';

test.describe('Login page', () => {

  test('renders the sign-in form with email, password and Google sign-in', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login with Google' })).toBeVisible();
  });

  test('disables the Sign in button until email and password are valid', async ({ page }) => {
    await page.goto('/login');

    const signInButton = page.getByRole('button', { name: 'Sign in' });
    await expect(signInButton).toBeDisabled();

    await page.getByLabel('Email').fill('player@example.com');
    await page.getByLabel('Password').fill('secret1');

    await expect(signInButton).toBeEnabled();
  });

  test('shows validation errors for an empty required field and an invalid email', async ({ page }) => {
    await page.goto('/login');

    const email = page.getByLabel('Email');
    const password = page.getByLabel('Password');

    await email.click();
    await password.click(); // blur email
    await expect(page.getByText('Email is required')).toBeVisible();

    await email.fill('not-an-email');
    await password.click(); // blur email again
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();

    await password.click();
    await email.click(); // blur password
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  // Regression test for the bug where loginWithGoogle() navigated to
  // /user synchronously, before the Google sign-in popup had even
  // resolved -- which crashed the profile page with "Cannot read properties
  // of undefined (reading 'displayName')" because the signed-in user hadn't
  // arrived yet. The fix awaits AuthService.doGoogleLogin() before doing
  // anything else, so dismissing the popup must leave the user on /login.
  test('does not navigate away before the Google sign-in popup resolves', async ({ page }) => {
    await page.goto('/login');

    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Login with Google' }).click();
    const popup = await popupPromise;
    await popup.close();

    // Give the rejected sign-in promise's catch handler a chance to run.
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/\/login$/);
  });

  // Regression test for the reported crash itself: visiting the profile
  // route before a user is loaded (e.g. mid sign-in, or directly while
  // signed out) must never render literal "undefined" or throw.
  test('visiting the profile page while signed out never shows "undefined" or throws', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/userprofile');

    await expect(page.locator('body')).not.toContainText('undefined');
    expect(pageErrors).toEqual([]);

    // The auth guard redirects signed-out users back to /login once the
    // (unauthenticated) auth state resolves.
    await expect(page).toHaveURL(/\/login$/);
  });

});
