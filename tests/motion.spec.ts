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

// Hero autoplay contract (NOTES.md, 2026-11-14): when the loop cannot play —
// autoplay refused, codec missing, file unreachable — the video is removed
// and the still is the hero: no half-loaded frame, no play glyph. Simulated
// here by failing the fetch.
test.describe('Hero loop fallback', () => {
  test('if the loop cannot play, only the still shows', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.route('**/media/beach-loop.mp4', (route) => route.abort());
    await page.goto('/');

    const video = page.locator('video.hero-video');
    await expect(video).toHaveClass(/is-blocked/);
    await expect(video).toBeHidden();
    await expect(
      page.getByAltText(/white-sand beach and clear atlantic water/i)
    ).toBeVisible();
  });
});
