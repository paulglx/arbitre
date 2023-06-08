import { test, expect } from '@playwright/test';

test('Create Course and add Exercises', async ({ page }) => {

    await test.step('login', async () => {

        // open the browser on the site
        await page.goto('/');
        // verify button is visible
        await expect(page.locator('a.btn-light.btn.btn-primary')).toBeVisible();
        // click in button
        await page.locator('a.btn-light.btn.btn-primary').click();
        // login
        await page.locator('#username').fill('lilibeth');
        await page.locator('#password').fill('Cesar//1973');
        await page.locator('#kc-login').click();

    });

    await test.step('create a course', async () => {
    
        // create a course
        await expect(page.locator('#create-course')).toBeVisible();
        await page.locator('#create-course').click();
        await page.locator('input.form-control').fill('Introduction to python');
        await page.locator('textarea.form-control').fill('This comprehensive Python programming course is designed to provide a solid foundation in Python programming concepts and techniques.');
        await page.locator('button.btn.btn-primary').click();

    });

    await test.step('create a session', async () => {

        // create a session
        await expect(page.locator('ul li button:has-text("Sessions")')).toBeVisible();
        await page.locator('ul li button:has-text("Sessions")').click();
        await expect(page.locator('a#create-session-no-sessions.btn.btn-light.mb-3.border')).toBeVisible();
        await page.locator('a#create-session-no-sessions.btn.btn-light.mb-3.border').click();
        await page.locator('input.form-control').fill('Algorithm: Binary Search');
        await page.locator('textarea.form-control').fill('Binary search is a commonly used searching algorithm that efficiently finds the position of a target element in a sorted array.');
        await page.locator('button.btn.btn-primary').click();

    }); 
   
    await test.step('create a exercises', async () => {

        // create a exercises
        await expect(page.locator('ul li button:has-text("Exercises")')).toBeVisible();
        await page.locator('ul li button#session-tabs-tab-exercises').click();
        await expect(page.locator('a.btn.btn-light.mb-3.border')).toBeVisible();
        await page.locator('a.btn.btn-light.mb-3.border').click();
        await page.locator('input.form-control').fill('Linear Search');
        await page.locator('textarea.form-control').fill('In this exercise, you are given a list of numbers and a target number. Your task is to implement a linear search algorithm to find if the target number exists in the list. The linear search algorithm sequentially checks each element in the list until the target number is found or the end of the list is reached.');
        await page.locator('button.btn.btn-primary').click();
        
    }); 
   
    await test.step('create a test', async () => {
    
        // create a test
        await expect(page.locator('ul li button:has-text("Test")')).toBeVisible();
        await page.locator('ul li button#exercise-tabs-tab-tests').click();
        await expect(page.locator('div#exercise-tabs-tabpane-tests button')).toBeVisible();
        await page.locator('div#exercise-tabs-tabpane-tests button').click();
        await expect(page.locator('div.col-md-3')).toBeVisible();
        await page.locator('div.col-md-3').click();
        await expect(page.locator('input.form-control').nth(0)).toBeVisible();
        await page.locator('input.form-control').nth(0).fill('Test 1');
        await expect(page.locator('textarea.form-control').nth(0)).toBeVisible();
        
        await page.locator('textarea.form-control').nth(0).type('5,2,8,10,3');
        await page.keyboard.press('Enter');
        await page.type('textarea.form-control', '8');
        
        await expect(page.locator('textarea.form-control').nth(1)).toBeVisible();
        await page.locator('textarea.form-control').nth(1).fill('True');
        await expect(page.locator('div.fade.tab-pane.active.show')).toBeVisible();
        await page.locator('div.fade.tab-pane.active.show').click();

    }); 
    
    await test.step('create runtime', async () => {

        // create runtime
        await expect(page.locator('button#exercise-tabs-tab-runtime')).toBeVisible();
        await page.locator('button#exercise-tabs-tab-runtime').click();
        await expect(page.locator('div.view-lines.monaco-mouse-cursor-text').nth(1)).toBeVisible();
        await page.locator('div.view-lines.monaco-mouse-cursor-text').nth(1).click();
        await page.type('div.view-lines.monaco-mouse-cursor-text', 'list_str = input().split(",")\nlist_int = [int(num) for num in list_str]\ntarget_number = int(input())\nprint(search_number(list_int, target_number),end="")');
        await expect(page.locator('button.btn.btn-primary.btn-sm').nth(0)).toBeVisible();
        await page.locator('button.btn.btn-primary.btn-sm').nth(0).click();

    }); 
    
    await test.step('create submission', async () => {

        // create submission
        await expect(page.locator('button#exercise-tabs-tab-submission')).toBeVisible();
        await page.locator('button#exercise-tabs-tab-submission').click();
        await expect(page.locator('input#formFile')).toBeVisible();
        await page.setInputFiles('input#formFile', '/home/lili/testArbitre/sol_search_number.py');
        await expect(page.locator('button.btn.btn-primary:has-text("Submit")')).toBeVisible();
        await page.locator('button.btn.btn-primary:has-text("Submit")').click();

    }); 
    /*await test.step('delete course', async () => {

                // go back to course
                await expect(page.locator('ol.breadcrumb li a').nth(1)).toBeVisible();
                await page.locator('ol.breadcrumb li a').nth(1).click();
        
                // delete course
                await expect(page.locator('button#delete-button')).toBeVisible();
                await page.locator('button#delete-button').click();
                await expect(page.locator('button#confirm-delete')).toBeVisible();
                await page.locator('button#confirm-delete').click();

    }); 
    */
 });