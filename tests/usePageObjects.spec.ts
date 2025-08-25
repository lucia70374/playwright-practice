import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach(async ({page}) => {
    await page.goto('/'); // Adjust the URL as needed
    });

test.describe('Page Object Model @regression', () => {
    test('navigate to form page', async ({page}) => {
        const pm = new PageManager(page); // created new instance of this class, passed the parameter page inside
        await pm.navigateTo.formLayoutsPage();// call method with dot notation
        await pm.navigateTo.datePickerPage();
        await pm.navigateTo.smartTablePage();
        await pm.navigateTo.toasterPage();
        await pm.navigateTo.tooltipPage();
    });

    test('parametrized methods', async({page}) => {
        const pm = new PageManager(page);

        await pm.navigateTo.formLayoutsPage();
        await pm.onFormLayoutsPage().submitUsingTheGridFormWithCrendentiailsAndSelectOption('test2@test.com', 'Welcome12', 'Option 1');
        // create a screenshot:
        await page.screenshot({path: 'screenshots/formLayoutsPage2.png', fullPage: true});
        await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('Tanja VB2', 'tanja2@test.com', true);
        // create a screenshot of a form with selectors
        await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'});
        await pm.navigateTo.datePickerPage();
        await pm.onDatepickerPage.selectCommonDatePickerDateFromToday(5);
        await pm.onDatepickerPage.selectDatePickerWithRangeFromToday(2, 8);
    })

});
