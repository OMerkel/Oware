import { expect, test } from '@playwright/test';

test.describe('Oware application', () => {
  test('loads the game board with the default Oware header', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#game-header-title')).toHaveText('Oware');
    await expect(page.locator('#board svg.oware-board')).toBeVisible();
    await expect(page.locator('#game-page')).not.toBeHidden();
    await expect(page.locator('#player-badge')).toBeVisible();
    await expect(page.locator('#player-badge-symbol')).toHaveText('\u{1F9D1}\u25BC');
  });

  test('hamburger menu opens the side panel and the backdrop closes it', async ({ page }) => {
    await page.goto('/index.html');
    const panel = page.locator('#side-panel');
    await expect(panel).not.toHaveClass(/open/);
    await page.locator('#menu-button').click();
    await expect(panel).toHaveClass(/open/);
    await page.locator('#panel-backdrop').click();
    await expect(panel).not.toHaveClass(/open/);
  });

  test('navigates to the Rules subpage, hiding the game board, then back', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('#menu-button').click();
    await page.locator('[data-navigate="rules"]').click();
    await expect(page.locator('#game-page')).toBeHidden();
    await expect(page.locator('#rules-page')).toBeVisible();
    await expect(page.locator('#side-panel')).not.toHaveClass(/open/);

    await page.locator('#rules-page [data-navigate-back]').first().click();
    await expect(page.locator('#rules-page')).toBeHidden();
    await expect(page.locator('#game-page')).toBeVisible();
  });

  test('navigates to Options, switches rules to Ouril, and the header updates', async ({
    page,
  }) => {
    await page.goto('/index.html');
    await page.locator('#menu-button').click();
    await page.locator('[data-navigate="options"]').click();
    await expect(page.locator('#options-menu')).toBeVisible();

    await page.locator('#rulesouril').check();
    await expect(page.locator('#game-header-title')).toHaveText('Ouril');

    await page.locator('#options-menu [data-navigate-back]').first().click();
    await expect(page.locator('#game-page')).toBeVisible();
  });

  test('About subpage is reachable and shows legal information', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('#menu-button').click();
    await page.locator('[data-navigate="about"]').click();
    await expect(page.locator('#about-page')).toBeVisible();
    await expect(page.locator('#about-page')).toContainText('MIT License');
  });

  test('a human move sows seeds around the board and updates the display', async ({ page }) => {
    await page.goto('/index.html');
    // Speed up sowing animation for the test.
    await page.locator('#menu-button').click();
    await page.locator('[data-navigate="options"]').click();
    await page.locator('#sowingspeed').uncheck();
    await page.locator('#options-menu [data-navigate-back]').first().click();

    const bowls = page.locator('#board image[role="button"]');
    const firstSouthBowl = bowls.nth(0);
    const hrefBefore = await firstSouthBowl.getAttribute('href');
    await firstSouthBowl.click();

    await expect
      .poll(async () => firstSouthBowl.getAttribute('href'), { timeout: 5000 })
      .not.toBe(hrefBefore);
  });

  test('new game restarts the board from the side panel', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('#menu-button').click();
    await page.locator('[data-navigate="options"]').click();
    await page.locator('#sowingspeed').uncheck();
    await page.locator('#options-menu [data-navigate-back]').first().click();

    await page.locator('#board image[role="button"]').nth(0).click();
    await page.waitForTimeout(200);

    await page.locator('#menu-button').click();
    await page.locator('#new').click();
    await expect(page.locator('#side-panel')).not.toHaveClass(/open/);
    await expect(page.locator('#board svg.oware-board')).toBeVisible();
  });

  test('accessibility smoke check: interactive controls expose labels/roles', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#menu-button')).toHaveAttribute('aria-label', 'Menu');
    const firstBowl = page.locator('#board image[role="button"]').first();
    await expect(firstBowl).toHaveAttribute('aria-label', /Bowl \d+/);
  });
});
