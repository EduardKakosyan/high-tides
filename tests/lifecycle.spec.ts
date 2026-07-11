import { test, expect } from '@playwright/test';

// ClientRouter lifecycle guard: bundled scripts run once per visit, but the
// DOM is replaced on every client-side navigation. These tests catch the
// classic regression — interactive widgets dead after navigating — by always
// *arriving* at the page via a client-side swap, never a full load.
test.describe('ClientRouter lifecycle', () => {
  test('lightbox still opens after client-side navigation to /gallery', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /see the cottage/i }).click();
    await expect(page).toHaveURL(/\/gallery\/?$/);

    const firstThumb = page.locator('[data-lightbox-trigger]').first();
    await firstThumb.scrollIntoViewIfNeeded();
    await firstThumb.click();

    const lightbox = page.locator('#lightbox');
    await expect(lightbox).toBeVisible();
    await expect(
      lightbox.getByRole('button', { name: /close gallery viewer/i })
    ).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
  });

  test('inquiry form still submits after a round trip to /gallery and back', async ({
    page,
  }) => {
    await page.route('/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, body: 'OK' });
      } else {
        await route.continue();
      }
    });

    await page.goto('/gallery');
    await page.getByRole('link', { name: /back to home/i }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.fill('#inquiry-name', 'Avery Tester');
    await page.fill('#inquiry-email', 'avery@example.com');
    await page.getByRole('button', { name: /send your inquiry/i }).click();

    await expect(page.locator('#inquiry-success')).toBeVisible();
    await expect(page.locator('#inquiry-form')).toBeHidden();
  });
});
