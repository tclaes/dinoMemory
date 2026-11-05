import {expect, test} from '@playwright/test';

const AUTH_EMULATOR = 'http://127.0.0.1:9099';

const uniqueEmail = () =>
  `player-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

test.describe('Register page', () => {

  test('renders the card centred in the viewport', async ({ page }) => {
    await page.goto('/register');

    const card = page.locator('.auth-card');
    await expect(card).toBeVisible();

    const box = (await card.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(2);
  });

  test('fits a narrow mobile viewport without horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto('/register');

    await expect(page.locator('.auth-card')).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('disables Register until name, email and password are valid', async ({ page }) => {
    await page.goto('/register');
    const register = page.getByRole('button', { name: 'Register' });
    await expect(register).toBeDisabled();

    await page.getByLabel('Name').fill('Player One');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Password').fill('abc');
    await page.getByLabel('Name').click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
    await expect(page.getByText('Password minimum of 6 characters')).toBeVisible();
    await expect(register).toBeDisabled();

    await page.getByLabel('Email').fill(uniqueEmail());
    await page.getByLabel('Password').fill('secret123');
    await expect(register).toBeEnabled();
  });

  test('registers a new player, signs in and lands on the game page', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Name').fill('Player One');
    await page.getByLabel('Email').fill(uniqueEmail());
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: 'Bye!' })).toBeVisible();
  });

  test('shows an error and stays on the form when the email is already in use', async ({ page, request }) => {
    const email = uniqueEmail();
    const signUp = await request.post(
      `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`,
      { data: { email, password: 'secret123' } },
    );
    expect(signUp.ok()).toBe(true);

    await page.goto('/register');
    await page.getByLabel('Name').fill('Player Two');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByRole('alert').filter({ hasText: 'This email is already in use.' })).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByLabel('Email')).toHaveValue(email);
    await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled();
  });
});
