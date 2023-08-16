/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@playwright/test';

test('Create Course and add Exercises', async ({ page }) => {
    const teacher_username = 'lilibeth';
    const teacher_password = 'lilibeth';
    const student_username = 'lilibeth_eleve';


    await test.step('login', async () => {

        // open the browser on the site
        await page.goto('/');
        // verify button is visible
        await expect(page.getByTestId('login-button')).toBeVisible();
        // click in button
        await page.getByTestId('login-button').click();
        // login
        await page.locator('#username').fill(teacher_username);
        await page.locator('#password').fill(teacher_password);
        await page.locator('#kc-login').click();

    });

    await test.step('create a course', async () => {

        // create a course
        await expect(page.locator('#create-course')).toBeVisible();
        await page.locator('#create-course').click();
        await page.locator('#root').click();
        await page.locator('#title-editable').click();
        await page.locator('#title-input').fill('Introduction to python');
        await page.locator('#description-editable').click();
        await page.locator('#description-input').fill('This comprehensive Python programming course is designed to provide a solid foundation in Python programming concepts and techniques.');
        await page.locator('#create-session-button').click();

    });

    await test.step('invite student', async () => {

        // invite student
        await expect(page.locator('#exercise-tab-students')).toBeVisible();
        await page.locator('#exercise-tab-students').click();

        await page.getByLabel('Search users').fill(student_username);
        await page.getByLabel('Add student').click();
    });

    await test.step('create a session', async () => {

        // create a session
        await expect(page.locator('#exercise-tab-sessions')).toBeVisible();
        await page.locator('#exercise-tab-sessions').click();

        await expect(page.locator('#create-session-button')).toBeVisible();
        await page.locator('#create-session-button').click();
        await expect(page.locator('#title-editable')).toBeVisible();
        await page.locator('#title-editable').click();
        await page.locator('#title-input').fill('Algorithm: Binary Search');
        await page.locator('#description-editable').click();
        await page.locator('#description-input').fill('Binary search is a commonly used searching algorithm that efficiently finds the position of a target element in a sorted array.');
        await page.locator('#create-exercise-button').click();

    });

    await test.step('create a exercises', async () => {

        // create a exercises
        await expect(page.locator('#create-exercise-button')).toBeVisible();
        await page.locator('#create-exercise-button').click();
        await expect(page.locator('#title-editable')).toBeVisible();
        await page.locator('#title-editable').click();
        await page.locator('#title-input').fill('Linear Search');
        await page.locator('#description-editable').click();
        await page.locator('#description-input').fill('In this exercise, you are given a list of numbers and a target number. Your task is to implement a linear search algorithm to find if the target number exists in the list. The linear search algorithm sequentially checks each element in the list until the target number is found or the end of the list is reached.');
        await page.locator('#create-test-button').click();
    });

    await test.step('create a test', async () => {

        // create a test
        await expect(page.locator('#create-test-button')).toBeVisible();
        await page.locator('#create-test-button').click();

        await expect(page.getByLabel('Test name').nth(0)).toBeVisible();
        await page.locator('.test-name-input-wrapper').nth(0).click();
        await page.getByLabel('Test name').nth(0).fill('Test 1');
        await expect(page.locator('textarea.form-control').nth(0)).toBeVisible();

        await page.locator('textarea.form-control').nth(0).type('5,2,8,10,3');
        await page.keyboard.press('Enter');
        await page.type('textarea.form-control', '8');

        await expect(page.locator('textarea.form-control').nth(1)).toBeVisible();
        await page.locator('textarea.form-control').nth(1).fill('True');
        await page.locator('.test-name-input-wrapper').nth(0).click();

    });

    await test.step('create runtime', async () => {

        // create runtime
        await expect(page.locator('#exercise-tab-runtime')).toBeVisible();
        await page.locator('#exercise-tab-runtime').click();
        await expect(page.locator('div.view-lines.monaco-mouse-cursor-text').nth(1)).toBeVisible();
        await page.locator('div.view-lines.monaco-mouse-cursor-text').nth(1).click();
        await page.type('div.view-lines.monaco-mouse-cursor-text', 'list_str = input().split(",")\nlist_int = [int(num) for num in list_str]\ntarget_number = int(input())\nprint(search_number(list_int, target_number),end="")');
        await page.locator('#exercise-tab-runtime').click();

    });

    await test.step('create submission', async () => {

        // create submission
        await expect(page.locator('#exercise-tab-submission')).toBeVisible();
        await page.locator('#exercise-tab-submission').click();
        await expect(page.locator('#exercise-submission-input')).toBeVisible();
        await page.setInputFiles('#exercise-submission-input', './tests/test-files/sol_search_number.py');
        await expect(page.locator('#exercise-submission-button')).toBeVisible();
        await page.locator('#exercise-submission-button').click();

    });
});