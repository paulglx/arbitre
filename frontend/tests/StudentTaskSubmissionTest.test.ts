/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@playwright/test';

test('Student task Submission Test', async ({ page }) => {
    const teacher_username = 'lilibeth';
    const teacher_password = 'lilibeth';
    const student_username = 'lilibeth_eleve';
    const student_password = 'lilibeth';


    await test.step('student login', async () => {

        // open the browser on the site
        await page.goto('/');
        // verify button is visible
        await expect(page.getByTestId('login-button')).toBeVisible();
        // click in button
        await page.getByTestId('login-button').click();
        // login
        await page.locator('#username').fill(student_username);
        await page.locator('#password').fill(student_password);
        await page.locator('#kc-login').click();

    });

    await test.step('student submission', async () => {

        await page.locator('.course-title:has-text("Introduction to python")').click();
        // enter in the session
        await expect(page.locator('#sessions-wrapper a').nth(0)).toBeVisible();
        await page.locator('#sessions-wrapper a').nth(0).click();

        // enter in the exercise
        await expect(page.locator('#exercises-wrapper a').nth(0)).toBeVisible();
        await page.locator('#exercises-wrapper a').nth(0).click();

        // submission

        await expect(page.locator('#exercise-submission-input')).toBeVisible();
        await page.setInputFiles('#exercise-submission-input', './tests/test-files/sol.py');
        await expect(page.locator('#exercise-submission-button')).toBeVisible();
        await page.locator('#exercise-submission-button').click();
    });

    await test.step('student sign out', async () => {
        // click in button
        await page.locator('#dropdown').click();
        await page.locator('#dropdown-menu ul li button').nth(0).click();
    });

    await test.step('teacher login', async () => {

        // open the browser on the site
        await page.goto('/');
        // verify button is visible
        await page.waitForTimeout(1500);
        await expect(page.getByTestId('login-button')).toBeVisible();
        // click in button
        await page.getByTestId('login-button').click();
        // login
        await page.locator('#username').fill(teacher_username);
        await page.locator('#password').fill(teacher_password);
        await page.locator('#kc-login').click();

    });

    await test.step('teacher delete course', async () => {

        // go back to course
        await page.locator('.course-title:has-text("Introduction to python")').click();

        // delete course
        await expect(page.locator('#delete-course-button')).toBeVisible();
        await page.locator('#delete-course-button').click();
        await expect(page.locator('#accept-button')).toBeVisible();
        await page.locator('#accept-button').click();

    });
});