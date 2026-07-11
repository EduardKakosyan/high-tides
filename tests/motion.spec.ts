import { test, expect } from '@playwright/test';

// Motion is a feature of this site, and so is its absence: visitors with
// prefers-reduced-motion must get the calm, still version. These tests pin
// that contract before/while the site grows scroll-driven animation.
test.describe('Reduced motion', () => {
  test('hero video is hidden; the still remains', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('video.hero-video')).toBeHidden();
    await expect(
      page.getByAltText(/white-sand beach and clear atlantic water/i)
    ).toBeVisible();
  });

  test('hero video shows for motion-tolerant visitors', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    await expect(page.locator('video.hero-video')).toBeVisible();
  });
});
