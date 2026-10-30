import {expect, test} from '@playwright/test';

const AUTH_EMULATOR = 'http://127.0.0.1:9099';

test.describe('Logout', () => {

  test.beforeEach(async ({ page, request }) => {
    const email = `player-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const password = 'secret123';

    const signUp = await request.post(
      `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`,
      { data: { email, password, displayName: 'Player' } },
    );
    expect(signUp.ok()).toBe(true);

    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Bye!' })).toBeVisible();
  });

  // Regression test: logOut() used to navigate to "/", a no-op when already on "/",
  // so the auth guard never re-ran and the game stayed on screen after signing out.
  test('clicking Bye! signs the user out and shows the login page', async ({ page }) => {
    await expect(page).toHaveURL(/\/$/);

    await page.getByRole('button', { name: 'Bye!' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bye!' })).toHaveCount(0);
  });

  test('stays signed out: the game is not reachable after logging out', async ({ page }) => {
    await page.getByRole('button', { name: 'Bye!' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
  });

});
