import { test, expect } from '@playwright/test';

test.describe('Authentication & Router Guards E2E Tests', () => {

  test('TC_E2E_AUTH_001: Unauthenticated user is redirected from /profile to /login (Router Guard)', async ({ page }) => {
    // Attempt to access protected profile page directly
    await page.goto('/profile');

    // Assert that router guard intercepts request and redirects to login
    await expect(page).toHaveURL(/\/login/);
    
    // Verify login page elements are visible
    await expect(page.locator('h1')).toHaveText('Welcome Back');
  });

  test('TC_E2E_AUTH_002: Login with invalid credentials displays error toast', async ({ page }) => {
    await page.goto('/login');

    // Fill login form fields
    await page.locator('input[name="email"]').fill('nonexistent.qa@example.com');
    await page.locator('input[name="password"]').fill('WrongPassword123');

    // Click submit button
    await page.locator('button[type="submit"]').click();

    // Verify error toast message appears
    const errorToast = page.getByText(/login failed/i);
    await expect(errorToast).toBeVisible();
    
    // Verify page state remains on /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_E2E_AUTH_003: Login with valid credentials successfully redirects to profile', async ({ page }) => {
    // This test simulates the happy path flow.
    await page.goto('/login');

    // Fill valid details
    await page.locator('input[name="email"]').fill('jane.doe.test@example.com');
    await page.locator('input[name="password"]').fill('Password123');

    // Submit
    await page.locator('button[type="submit"]').click();

    // Assert redirection to user dashboard/profile page
    await expect(page).toHaveURL(/\/profile/);

    // Verify profile dashboard greeting or elements are visible
    const logoutBtn = page.getByRole('button', { name: /logout/i });
    await expect(logoutBtn).toBeVisible();
  });
});
