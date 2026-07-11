import { test, expect } from '@playwright/test';

// Hero CTAs (issue #17): the two buttons offer two real paths — inquire now,
// or browse the Cottage's photos first. Assert destinations, not page-load
// mechanics, so these survive a future ClientRouter migration unchanged.
test.describe('Hero CTAs', () => {
  test('"Request your stay" targets the Inquire section', async ({ page }) => {
    await page.goto('/');

    const cta = page.getByRole('link', { name: /request your stay/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '#inquire');
  });

  test('"See the cottage" navigates to the gallery', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /see the cottage/i }).click();

    await expect(page).toHaveURL(/\/gallery\/?$/);
    await expect(
      page.getByRole('heading', { level: 1 })
    ).toBeVisible();
  });
});
