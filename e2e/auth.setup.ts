import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/login');
  await page.locator('input[name="email"]').fill('fake.edwards@example.com');
  await page.locator('input[name="password"]').fill('fakepassword');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('/dashboard');

  await page.context().storageState({ path: authFile });
});
