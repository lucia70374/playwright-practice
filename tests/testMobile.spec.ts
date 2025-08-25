import {test, expect} from '@playwright/test';

test('input fields', async ({page}, testInfo) => {// if you want to use test on both mobile and desctop platforms, you can use testInfo.project.name...
        await page.goto('/');
        if (testInfo.project.name === 'mobile') {
            await page.locator('.sidebar-toggle').click();
        }
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
        if (testInfo.project.name === 'mobile') {
            await page.locator('.sidebar-toggle').click();
        }

        const inputEmail = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await inputEmail.fill('test@test.com');
        await inputEmail.clear();// can't be chained with fill
        await inputEmail.pressSequentially('test2@test.com');
    });