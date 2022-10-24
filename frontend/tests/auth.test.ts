/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test('Register, Login, Logout', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'No account yet ?' }).click();
  await expect(page).toHaveURL('http://localhost:3000/register');
  await page.getByLabel('Username:').click();
  await page.getByLabel('Password:').fill('testuser');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('testpwd');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.goto('http://localhost:3000/');
  await page.getByLabel('Username:').click();
  await page.getByLabel('Username:').fill('testuser');
  await page.getByLabel('Username:').press('Tab');
  await page.getByLabel('Password:').fill('testpwd');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('http://localhost:3000/course');
  await page.getByRole('button', { name: 'testuser' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
});