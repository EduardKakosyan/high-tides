import { test, expect, type Page } from '@playwright/test';

// The navbar (Header.astro, src/scripts/tabs.ts): on desktop the section
// links scroll the story page and track the current section; on phones the
// same sections sit behind tabs and only the active panel is laid out. The
// Pixel 7 project exercises the phone side, Desktop Chrome the other.

// "Laid out" is the question, not "revealed": headings carry data-reveal and
// sit at visibility:hidden until scrolled into view. A hidden panel has no box.
async function layout(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { laidOut: r.width > 0 && r.height > 0, top: r.top + window.scrollY };
  });
}

test.describe('Navbar and section tabs', () => {
  test('phone: Overview is open, other panels are hidden', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile layout only');
    await page.goto('/');

    await expect(page.getByRole('tablist', { name: /sections/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#the-area-heading')).toBeHidden();
    await expect(page.locator('#inquiry-form')).toBeHidden();

    // Both Overview sections are laid out, and the essentials lead on a phone.
    const facts = await layout(page, '#quick-facts-heading');
    const view = await layout(page, '#the-view-heading');
    expect(facts.laidOut).toBe(true);
    expect(view.laidOut).toBe(true);
    expect(facts.top).toBeLessThan(view.top);
  });

  test('phone: tapping a tab swaps panels and writes the fragment', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile layout only');
    await page.goto('/');

    await page.getByRole('tab', { name: 'Inquire' }).click();
    await expect(page.locator('#inquiry-form')).toBeVisible();
    await expect(page.locator('#overview')).toBeHidden();
    await expect(page.getByRole('tab', { name: 'Inquire' })).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/#inquiry$/);

    await page.getByRole('tab', { name: 'Overview' }).click();
    await expect(page.locator('#overview')).toBeVisible();
    await expect(page.locator('#inquiry-form')).toBeHidden();
    await expect(page).not.toHaveURL(/#/);
  });

  test('phone: the hero CTA opens the Inquire tab and lands on the form', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile layout only');
    await page.goto('/');

    await page.getByRole('link', { name: /request your stay/i }).first().click();

    await expect(page.getByRole('tab', { name: 'Inquire' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#inquiry-form')).toBeVisible();
    await expect(page.locator('#inquire-heading')).toBeInViewport();
  });

  test('phone: a deep link opens its tab', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile layout only');

    await page.goto('/#cottage');
    await expect(page.getByRole('tab', { name: 'Cottage' })).toHaveAttribute('aria-selected', 'true');
    expect((await layout(page, '#the-home-heading')).laidOut).toBe(true);

    // An anchor inside a panel (the form section's own id) opens that panel too.
    await page.goto('/#inquire');
    await expect(page.locator('#inquiry-form')).toBeVisible();
    await expect(page.locator('#overview')).toBeHidden();
  });

  test('phone: tabs still work after a round trip through /gallery', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile layout only');
    await page.goto('/');
    await page.getByRole('link', { name: /see the photos/i }).click();
    await expect(page).toHaveURL(/\/gallery\/?$/);
    await page.getByRole('link', { name: /back to home/i }).first().click();
    await expect(page).toHaveURL(/\/$/);

    await page.getByRole('tab', { name: 'Area' }).click();
    expect((await layout(page, '#the-area-heading')).laidOut).toBe(true);
    await expect(page.locator('#overview')).toBeHidden();
  });

  test('desktop: section links scroll the page and track the current section', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop layout only');
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: /sections/i });
    await expect(nav).toBeVisible();
    await expect(page.locator('[data-tablist]')).toBeHidden();

    for (const selector of [
      '#the-view-heading',
      '#quick-facts-heading',
      '#the-home-heading',
      '#the-stay-heading',
      '#the-area-heading',
      '#the-host-heading',
      '#inquire-heading',
    ]) {
      expect((await layout(page, selector)).laidOut, `${selector} laid out`).toBe(true);
    }
    // Locked desktop order: The view before the essentials (phones reverse them).
    const view = await layout(page, '#the-view-heading');
    const facts = await layout(page, '#quick-facts-heading');
    expect(view.top).toBeLessThan(facts.top);

    const area = nav.getByRole('link', { name: 'Area' });
    await area.click();
    await expect(page.locator('#the-area-heading')).toBeInViewport();
    await expect(area).toHaveAttribute('aria-current', 'true');
  });

  test('header: transparent over the hero, solid afterwards, colour wordmark on /gallery', async ({ page, isMobile }) => {
    await page.goto('/');
    const header = page.locator('[data-site-header]');
    await expect(header).toHaveAttribute('data-over-hero', '');
    await expect(header.locator('.wordmark-light')).toBeVisible();

    await page.evaluate(() => {
      const anchor = document.querySelector('[data-tabs-anchor]')!;
      window.scrollTo(0, anchor.getBoundingClientRect().top + window.scrollY + 200);
    });
    await expect(header).not.toHaveAttribute('data-over-hero', '');
    if (isMobile) {
      // Past the hero a phone keeps only the tab row; the top row folds away.
      await expect(header.locator('.nav-top')).toBeHidden();
      await expect(header.locator('[data-tablist]')).toBeVisible();
    } else {
      await expect(header.locator('.wordmark-brand')).toBeVisible();
    }

    await page.goto('/gallery');
    await expect(header).not.toHaveAttribute('data-over-hero', '');
    await expect(header.locator('.wordmark-brand')).toBeVisible();
    await expect(header.locator('.wordmark-light')).toBeHidden();
  });
});
