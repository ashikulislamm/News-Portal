import { test, expect } from '@playwright/test';

test.describe('News Content Management E2E Tests', () => {

  // Auto-login before running each content creation test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('jane.doe.test@example.com');
    await page.locator('input[name="password"]').fill('Password123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('TC_E2E_NEWS_001: Authenticated user can publish a news article successfully', async ({ page }) => {
    // Navigate to "Publish News Article" section in sidebar dashboard
    const publishSidebarBtn = page.getByRole('button', { name: /publish news/i });
    await expect(publishSidebarBtn).toBeVisible();
    await publishSidebarBtn.click();

    // Fill Title
    await page.locator('input[name="title"]').fill('Automated QA Automation in 2026');

    // Fill Short Description
    await page.locator('textarea[name="description"]').fill('E2E validation keeps monorepos highly resilient and ensures zero regressions.');

    // Select category (e.g. Technology)
    await page.locator('select[name="category"]').selectOption('Technology');

    // Select language
    await page.locator('select[name="language"]').selectOption('en');

    // Add tags
    await page.locator('input[name="tags"]').fill('playwright, testing, e2e');

    // Locate and click submit button
    const submitBtn = page.getByRole('button', { name: /publish article online/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Assert that the article publish success toast appears
    const successToast = page.getByText(/news article published successfully/i);
    await expect(successToast).toBeVisible();

    // Assert redirection or section change to "My Articles" list
    const myArticlesTab = page.getByText(/my articles/i);
    await expect(myArticlesTab).toBeVisible();
  });
});
