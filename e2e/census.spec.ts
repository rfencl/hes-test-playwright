
import { test, expect, Page } from '@playwright/test';
// @ts-ignore
import { Pool } from 'pg'; 

const pool = new Pool({
  user: 'postgres',
  host: '192.168.12.116',
  database: 'census_app',
  password: 'postgres',
  port: 5432,
});

test.describe('Census App', () => {
  test.afterAll(async () => {
    await pool.end();
  });

  test('should add a new person record to the household', async ({ page }) => {
    await page.goto('/dashboard');
  

    // Add record
    await page.locator('button:has-text("Add record")').click();

    await page.locator('select[name="relationship"]').selectOption('SPOUSE');
    await page.locator('input[name="firstName"]').fill('FAKE');
    await page.locator('input[name="lastName"]').fill('USER');
    await page.locator("input[placeholder*='Pick a date'], input[type='date']").fill('01/01/2000');
    await page.locator("button[role='radio'][value='MALE']").click();

    // Select Hispanic
    await page.locator('#hispanic').getByRole('combobox').click();
    await page.getByRole('option', { name: 'NO', exact: true }).click();

    // Select Race
    await page.locator('#race').getByRole('combobox').click();
    await page.getByRole('option', { name: 'WHITE', exact: true }).click();

    // Select Other stay
    await page.locator('#otherStay').getByRole('combobox').click();
    await page.getByRole('option', { name: 'NO', exact: true }).click();

    await page.locator('button[type="submit"]').click();

    // Wait for success message and close dialog
    await expect(page.getByTestId('success-message')).toBeVisible();
    await page.locator('button[type="reset"]:has-text("OK")').click();

    // Verify record in UI
    await page.reload();
    await expect(page.locator('.loading-record-card')).not.toBeVisible({ timeout: 10000 });
    const recordCard = page.locator('.record-card')
      .filter({ has: page.locator('p.full-name', { hasText: 'FAKE USER' }) });
  });

  test('should return the added person record in an API call', async ({ page }) => {
    const response = await page.request.get('/api/record/user', {
      params: {
        email: 'fake.edwards@example.com'
      }
    });
    const json = await response.json();
    const record = json.records.find((r: { firstName: string; lastName: string; }) => r.firstName === 'FAKE' && r.lastName === 'USER');
    expect(record).toBeDefined();
  });

  test('should find the added person record in the database', async () => {
    const { rows } = await pool.query('SELECT * FROM "Record" WHERE "firstName" = $1 AND "lastName" = $2', ['FAKE', 'USER']);
    expect(rows.length).toBe(1);
  });

  test('should delete the person record', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for the record card to be visible
    const recordCard = page.locator('.record-card')
      .filter({ has: page.locator('p.full-name', { hasText: 'FAKE USER' }) });
    await recordCard.waitFor();

    await recordCard.locator('[name="delete-record-button btn"]').click();

    // Wait for the dialog to be visible
    await page.locator('[role="alertdialog"]').waitFor();

    await page.locator('[role="alertdialog"] button:has-text("Delete")').click();
    await page.reload();
    // Verify record is deleted in UI
    await expect(page.locator(':text("FAKE USER")')).not.toBeVisible();
  });

  test('should not find the deleted person record in the database', async () => {
    const { rows } = await pool.query('SELECT * FROM "Record" WHERE "firstName" = $1 AND "lastName" = $2', ['FAKE', 'USER']);
    expect(rows.length).toBe(0);
  });
});
