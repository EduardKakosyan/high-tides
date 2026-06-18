import { test, expect } from '@playwright/test';

// Happy-path coverage for the Inquiry experience (issue #8).
// We intercept the POST to "/" so no real Netlify backend is needed, then
// assert the success panel appears and the form is replaced.
test.describe('Inquiry form', () => {
  test('renders all six fields', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#inquiry-name')).toBeVisible();
    await expect(page.locator('#inquiry-email')).toBeVisible();
    await expect(page.locator('#inquiry-arrival')).toBeVisible();
    await expect(page.locator('#inquiry-departure')).toBeVisible();
    await expect(page.locator('#inquiry-guests')).toBeVisible();
    await expect(page.locator('#inquiry-message')).toBeVisible();
  });

  test('submits and shows the success panel', async ({ page }) => {
    // Stub the Netlify Forms endpoint so submission succeeds offline.
    await page.route('/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, body: 'OK' });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    await page.fill('#inquiry-name', 'Avery Tester');
    await page.fill('#inquiry-email', 'avery@example.com');
    await page.fill('#inquiry-arrival', '2026-07-10');
    await page.fill('#inquiry-departure', '2026-07-17');
    await page.selectOption('#inquiry-guests', '3');
    await page.fill('#inquiry-message', 'Looking forward to a week by the beach!');

    await page.getByRole('button', { name: /send your inquiry/i }).click();

    // Success panel becomes visible; the form is hidden.
    await expect(page.locator('#inquiry-success')).toBeVisible();
    await expect(page.locator('#inquiry-form')).toBeHidden();
    await expect(page.locator('#inquiry-error')).toBeHidden();
  });
});
