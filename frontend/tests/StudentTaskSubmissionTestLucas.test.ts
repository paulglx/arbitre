import { test, expect } from '@playwright/test';

test('Student task Submission Test ', async ({ page }) => {

    await test.step('login', async () => {

        // open the browser on the site
        await page.goto('/');
        // verify button is visible
        await expect(page.locator('a.btn-light.btn.btn-primary')).toBeVisible();
        // click in button
        await page.locator('a.btn-light.btn.btn-primary').click();
        // login
        await page.locator('#username').fill('lucas');
        await page.locator('#password').fill('lilibeth');
        await page.locator('#kc-login').click();

    });

    await test.step('join a course', async () => {

        // join a course
        await expect(page.locator('a.list-group-item.list-group-item-action')).toBeVisible();
        await page.locator('a.list-group-item.list-group-item-action').click();
        await expect(page.locator('form.jc-input-group input').nth(0)).toBeVisible();
        await page.locator('form.jc-input-group input').nth(0).fill('9XA2FO9U');
        await expect(page.locator('button.btn.btn-primary')).toBeVisible();
        await page.locator('button.btn.btn-primary').click();

    });
    
    await test.step('submission', async () => {
            // enter in the session
            await expect(page.locator('a.list-group-item.list-group-item-light.list-group-item-action').nth(0)).toBeVisible();
            await page.locator('a.list-group-item.list-group-item-light.list-group-item-action').click();

        for (let i = 1; i <= 9; i++) {
            
            // enter in the exercise
            await expect(page.locator('div.list-group a').nth(i - 1)).toBeVisible();
            await page.locator('div.list-group a').nth(i - 1).click();

            // submission
            await expect(page.locator('button#exercise-tabs-tab-submission')).toBeVisible();
            await page.locator('button#exercise-tabs-tab-submission').click();

            await expect(page.locator('input#formFile')).toBeVisible();
            await page.setInputFiles('input#formFile', '/home/lili/testArbitre/sol.py');
            await expect(page.locator('button.btn.btn-primary:has-text("Submit")')).toBeVisible();
            await page.locator('button.btn.btn-primary:has-text("Submit")').click();
    
            await expect(page.locator('li.breadcrumb-item a').nth(2)).toBeVisible();
            await page.locator('li.breadcrumb-item a').nth(2).click();

        }
    });

});