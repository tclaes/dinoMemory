import {expect, test} from '@playwright/test';

const uniqueEmail = () =>
  `player-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

test.describe('Profile page', () => {
  let email: string;

  test.beforeEach(async ({ page }) => {
    email = uniqueEmail();
    await page.goto('/register');
    await page.getByLabel('Name').fill('Player One');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('button', { name: 'Bye!' })).toBeVisible();
  });

  test('opens from the header profile button and shows the account details', async ({ page }) => {
    await page.getByRole('link', { name: 'Your profile' }).click();

    await expect(page).toHaveURL(/\/user$/);
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible();
    await expect(page.getByLabel('Name')).toHaveValue('Player One');
    await expect(page.getByText(email)).toBeVisible();
  });

  test('changes the display name and keeps it after a reload', async ({ page }) => {
    await page.getByRole('link', { name: 'Your profile' }).click();
    await page.getByLabel('Name').fill('Dino Fan');
    await page.getByRole('button', { name: 'Save name' }).click();
    await expect(page.getByText('Your name has been saved.')).toBeVisible();

    await page.reload();
    await expect(page.getByLabel('Name')).toHaveValue('Dino Fan');
  });

  test('disables saving an empty name', async ({ page }) => {
    await page.goto('/user');
    await page.getByLabel('Name').fill('');
    await page.getByLabel('Name').blur();
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save name' })).toBeDisabled();
  });

  test('shows an error for a wrong current password', async ({ page }) => {
    await page.getByRole('link', { name: 'Your profile' }).click();
    await page.getByLabel('Current password').fill('not-my-password');
    await page.getByLabel('New password').fill('another123');
    await page.getByRole('button', { name: 'Change password' }).click();

    await expect(page.getByText('Your current password is incorrect.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Change password' })).toBeEnabled();

    // The failed attempt must not have changed the password.
    await page.getByRole('button', { name: 'Bye!' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Bye!' })).toBeVisible();
  });

  test('changes the password and signs in with the new one', async ({ page }) => {
    await page.getByRole('link', { name: 'Your profile' }).click();
    await page.getByLabel('Current password').fill('secret123');
    await page.getByLabel('New password').fill('another123');
    await page.getByRole('button', { name: 'Change password' }).click();
    await expect(page.getByText('Your password has been changed.')).toBeVisible();
    await expect(page.getByLabel('Current password')).toHaveValue('');

    await page.getByRole('button', { name: 'Bye!' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('another123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Bye!' })).toBeVisible();
  });

  test('fits a narrow mobile viewport without horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    // Go there directly: the existing header is wider than 375px, so clicking its
    // profile button makes Playwright scroll the clipped layout sideways.
    await page.goto('/user');

    const card = page.locator('.auth-card');
    await expect(card).toBeVisible();
    const box = (await card.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('sends a signed-out visitor to the login page', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/user');
    await expect(page).toHaveURL(/\/login$/);
    await context.close();
  });
});
