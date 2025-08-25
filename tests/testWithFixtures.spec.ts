import { test } from '../testOptions';

// test.beforeEach(async ({page}) => {
    // await page.goto('/');
    // });

test.describe('Fixtures example @regression', () => {

    test('parametrized methods with fixture', async({pageManager}) => {

        // await pm.navigateTo.formLayoutsPage();
        await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCrendentiailsAndSelectOption('test@test.com', 'Welcome1', 'Option 1');
        await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('Tanja VB', 'tanja@test.com', true);
    })

});