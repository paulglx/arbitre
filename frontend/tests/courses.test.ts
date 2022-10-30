/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

//Allows `require` to work in TypeScript
declare var require:any;
const { exec } = require('node:child_process');
const process = require('process');

//Create test teacher account, by settings its group to "Teachers"
test.beforeEach(async ({page}) => {
    process.chdir('../backend');
    exec("python manage.py shell < ../frontend/tests/create_teacher.py", (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
});

test('Course workflow', async ({ page }) => {
    await test.step('Login as teacher', async () => {
        await page.goto('http://localhost:3000/');
        await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="text"]').click();
        await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="text"]').fill('testteacher');
        await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="password"]').click();
        await page.getByRole('tabpanel', { name: 'Login' }).locator('input[type="password"]').fill('testpassword');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page).toHaveURL('http://localhost:3000/course');
    });
    await test.step('Create Course', async () => {
        await page.goto('http://localhost:3000/course');
        await page.getByRole('link', { name: '+ New course' }).click();
        await expect(page).toHaveURL('http://localhost:3000/course/create');
        await page.getByPlaceholder('Enter title').click();
        await page.getByPlaceholder('Enter title').fill('Test Course');
        await page.getByPlaceholder('Enter description').click();
        await page.getByPlaceholder('Enter description').fill('Test description **markdown enabled**');
        await page.getByRole('button', { name: 'Create course' }).click();
        await expect(page).toHaveURL('http://localhost:3000/course');
        await page.isVisible('text=Test Course');
    });
});