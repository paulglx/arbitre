/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test('Register, Logout, Login, Logout', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('tab', { name: 'Register' }).click();
  await page.getByRole('tabpanel', { name: 'Register' }).locator('input[type="text"]').click();
  await page.getByRole('tabpanel', { name: 'Register' }).locator('input[type="text"]').fill('testuser');
  await page.getByRole('tabpanel', { name: 'Register' }).locator('input[type="password"]').click();
  await page.getByRole('tabpanel', { name: 'Register' }).locator('input[type="password"]').fill('testpwd');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL('http://localhost:3000/course');
  await page.getByRole('button', { name: 'testuser' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await page.getByRole('tab', { name: 'Login' }).click();
  await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="text"]').click();
  await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="text"]').fill('testuser');
  await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="password"]').click();
  await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="password"]').fill('testpwd');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('http://localhost:3000/course');
  await page.getByRole('button', { name: 'testuser' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
});

