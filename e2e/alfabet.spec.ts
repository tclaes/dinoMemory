import {expect, test, Page} from '@playwright/test';

const AUTH_EMULATOR = 'http://127.0.0.1:9099';

// Phase 1 of the alfabet deck: letter -> word on the matching card.
const WORD_FOR_LETTER: Record<string, string> = {
  i: 'inkt', k: 'kat', m: 'maan', s: 'sok', p: 'pen', aa: 'aap', r: 'raket', e: 'emmer', v: 'vis',
};

test.describe('Alfabet deck', () => {
  // Unique per test run, so the scoreboard assertion is independent of scores left in a reused emulator.
  let playerName: string;

  test.beforeEach(async ({ page, request }) => {
    const email = `player-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const password = 'secret123';
    playerName = `Player ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const signUp = await request.post(
      `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`,
      { data: { email, password, displayName: playerName } },
    );
    expect(signUp.ok()).toBe(true);

    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Bye!' })).toBeVisible();

    await page.getByRole('link', { name: 'alfabet' }).click();
    await expect(page).toHaveURL(/\/game\/alfabet$/);
  });

  const letterCards = (page: Page) => page.locator('app-card').filter({ has: page.locator('.letter-face') });
  const wordCards = (page: Page) => page.locator('app-card').filter({ has: page.locator('.word-face') });
  const flip = (card: ReturnType<typeof letterCards>) => card.getByRole('button', { name: 'Flip card' }).click();

  test('deals eight letter cards and eight word cards', async ({ page }) => {
    await expect(letterCards(page)).toHaveCount(8);
    await expect(wordCards(page)).toHaveCount(8);
  });

  test('keeps a letter and its word face up as a pair', async ({ page }) => {
    const letterCard = letterCards(page).first();
    const letter = await letterCard.getByRole('img').getAttribute('aria-label');
    const wordCard = wordCards(page).filter({ has: page.getByRole('img', { name: WORD_FOR_LETTER[letter!] }) });

    await flip(letterCard);
    await flip(wordCard);

    await expect(letterCard).toHaveClass(/matched/);
    await expect(wordCard).toHaveClass(/matched/);
  });

  test('turns a letter and a wrong word back over', async ({ page }) => {
    const letterCard = letterCards(page).first();
    const letter = await letterCard.getByRole('img').getAttribute('aria-label');
    const wrongWord = wordCards(page).filter({ hasNot: page.getByRole('img', { name: WORD_FOR_LETTER[letter!] }) }).first();

    await flip(letterCard);
    await flip(wrongWord);

    await expect(letterCard).not.toHaveClass(/flip/, { timeout: 3000 });
    await expect(wrongWord).not.toHaveClass(/flip/);
    await expect(page.locator('app-card.matched')).toHaveCount(0);
  });

  test('does not match two letter cards', async ({ page }) => {
    const first = letterCards(page).nth(0);
    const second = letterCards(page).nth(1);

    await flip(first);
    await flip(second);

    await expect(first).not.toHaveClass(/flip/, { timeout: 3000 });
    await expect(second).not.toHaveClass(/flip/);
    await expect(page.locator('app-card.matched')).toHaveCount(0);
  });

  test('starts a new game when the shown deck is chosen again', async ({ page }) => {
    await flip(letterCards(page).first());
    await expect(page.locator('app-card.flip')).toHaveCount(1);

    await page.getByRole('link', { name: 'alfabet' }).click();

    await expect(page).toHaveURL(/\/game\/alfabet$/);
    await expect(page.locator('app-card.flip')).toHaveCount(0);
  });

  const winGame = async (page: Page) => {
    const count = await letterCards(page).count();
    for (let i = 0; i < count; i++) {
      const letterCard = letterCards(page).nth(i);
      const letter = await letterCard.getByRole('img').getAttribute('aria-label');
      const wordCard = wordCards(page).filter({ has: page.getByRole('img', { name: WORD_FOR_LETTER[letter!] }) });
      await flip(letterCard);
      await flip(wordCard);
      await expect(wordCard).toHaveClass(/matched/);
    }
  };

  test('shows the scoreboard with the saved score after winning, and starts a new game', async ({ page }) => {
    await winGame(page);

    const scoreboard = page.getByRole('dialog', { name: /You're #\d+|Game won/ });
    await expect(scoreboard).toBeVisible();
    await expect(scoreboard).toContainText('8 tries');
    await expect(scoreboard.getByRole('cell', { name: playerName })).toHaveCount(1);
    await expect(scoreboard.locator('.scoreboard-summary')).toHaveText(/^8 tries in \d{2}:\d{2}$/);
    const playerRow = scoreboard.getByRole('row').filter({ has: page.getByRole('cell', { name: playerName }) });
    await expect(playerRow.locator('td.mat-column-time')).toHaveText(/^\s*\d{2}:\d{2}\s*$/);
    await expect(playerRow).toHaveAttribute('aria-current', 'true');
    await expect(scoreboard.getByRole('heading')).toHaveText(/^You're #\d+$/);

    await scoreboard.getByRole('button', { name: 'New game?' }).click();

    await expect(page.locator('app-scoreboard')).toHaveCount(0);
    await expect(page.locator('app-card.matched')).toHaveCount(0);
    await expect(page.locator('app-card.flip')).toHaveCount(0);
  });

  test('closes the scoreboard, keeps the won board, and reopens it from the status bar', async ({ page }) => {
    await winGame(page);
    const scoreboard = page.getByRole('dialog');
    const showScores = page.getByRole('button', { name: 'Show scores' });
    await expect(scoreboard).toBeVisible();
    await expect(showScores).toHaveCount(0);

    await page.keyboard.press('Escape');
    await expect(scoreboard).toBeHidden();
    await expect(page.locator('app-card.matched')).toHaveCount(16);
    await expect(showScores).toBeVisible();

    await showScores.click();
    await expect(scoreboard).toBeVisible();
    await expect(scoreboard.getByRole('cell', { name: playerName })).toHaveCount(1);

    await page.mouse.click(5, 5);
    await expect(scoreboard).toBeHidden();

    await showScores.click();
    await scoreboard.getByRole('button', { name: 'Close scoreboard' }).click();
    await expect(scoreboard).toBeHidden();

    await page.getByRole('button', { name: 'Restart' }).click();
    await expect(page.locator('app-card.matched')).toHaveCount(0);
    await expect(showScores).toHaveCount(0);
  });

});
