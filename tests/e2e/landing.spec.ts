import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');

    // Check hero section
    await expect(page.locator('h1')).toContainText('CF Monorepo Starter');
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('should navigate to features page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Features');

    await expect(page).toHaveURL('/features');
    await expect(page.locator('h1')).toContainText('Features');
  });

  test('should navigate to docs page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Docs');

    await expect(page).toHaveURL('/docs');
    await expect(page.locator('h1')).toContainText('Documentation');
  });

  test('should have code snippets on features page', async ({ page }) => {
    await page.goto('/features');

    // Check for code examples
    await expect(page.locator('pre').first()).toBeVisible();
  });
});
