import {test, expect} from '@playwright/test';
import {NavigationPage} from '../page-objects/navigationPage'

test.describe.configure({mode: 'parallel'}); // run all tests in parallel

test.beforeEach(async ({page}) => {
    await page.goto('/'); // Adjust the URL as needed
    });

test.describe('Form Layouts Page @regression', () => {
    test.beforeEach(async ({page}) => {
        const navigatoTo = new NavigationPage(page);
        await navigatoTo.formLayoutsPage();
    });

    test('input fields', async ({page}) => {
        const inputEmail = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await inputEmail.fill('test@test.com');
        await inputEmail.clear();// can't be chained with fill
        await inputEmail.pressSequentially('test2@test.com', {delay: 500});

        //generic assertions
        const inputValue = await inputEmail.inputValue();// get the value of the input field
        expect(inputValue).toEqual('test2@test.com');

        // locator assertion
        await expect(inputEmail).toHaveValue('test2@test.com');
    });
    test.skip('radio buttons', async ({page}) => {
        const gridForm = page.locator('nb-card', { hasText: 'Using the Grid' });
        
        await gridForm.getByRole('radio', { name: 'Option 1' }).check({force:true});// only if visually-hidden
        await gridForm.getByLabel('Option 2').check({force:true});
        // generic assertion
        const radioStatus = await gridForm.getByRole('radio', { name: 'Option 2' }).isChecked();// will be a boolean
        /* visual testing, run the test twice, first time it will fail but create a snapshot and second time it will compare thos photos*/
        await expect(gridForm).toHaveScreenshot();
        /*
        expect(radioStatus).toBeTruthy();// or expect(radioStatus).toBe(true);
        // locator assertion
        await expect(gridForm.getByRole('radio', { name: 'Option 2' })).toBeChecked();

        expect(await gridForm.getByRole('radio', { name: 'Option 2' }).isChecked()).toBeTruthy();
        expect(await gridForm.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy();
        */

    });

});

test.describe('Toaster Page', () => {
    test.beforeEach(async ({page}) => {
        const navigateTo = new NavigationPage(page);
        await navigateTo.toasterPage();
    });

    test('checkboxes', async ({page}) => {
        await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force:true}); // cause it's already checked or click()
        await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force:true});
        const allBoxes = page.getByRole('checkbox');
        for(const box of await allBoxes.all()) {// creates an array of checkboxes with .all() so it can be looped through
            await box.check({force:true});
            expect(await box.isChecked()).toBeTruthy();
            await box.uncheck({force:true});
            expect(await box.isChecked()).toBeFalsy();
            await box.check({force:true});
            expect(await box.isChecked()).toBeTruthy();
        }
    });

    test('lists', async ({page}) => {
        const dropdownMenu = page.locator('ngx-header nb-select');
        await dropdownMenu.click();
        // const optionList = page.locator('#cdk-overlay-0'); //by id
        const optionList = page.locator('nb-option-list nb-option'); //by tags
        // await optionList.getByRole('list').click(); // list is used when a list has UL tag
        // await dropdownList.getByRole('listitem'); // listItem is used when a list has LI tag
        await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
        await optionList.filter({hasText: 'Cosmic'}).click(); // filter by text
        const header = page.locator('nb-layout-header');
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)'); // check the background color

        const colors = {
            "Light": "rgb(255, 255, 255)",
            "Dark": "rgb(34, 43, 69)",
            "Cosmic": "rgb(50, 50, 89)",
            "Corporate": "rgb(255, 255, 255)"
        }
        await dropdownMenu.click();
        for(const color in colors) {// loop for in object
            await optionList.filter({hasText: color}).click();
            await expect(header).toHaveCSS('background-color', colors[color]); //for displaying the color, bracket notation for accessing object properties
            if(color != 'Corporate') {
                await dropdownMenu.click();
            }
        }
    });
});

test.describe('Tooltip Page', () => {// mesages that appear when hovering over an element
    test.beforeEach(async ({page}) => {//in inspect elements, go to sources, find tooltip and while hovering over it press f8, after that return to elements and search for its selector
        const navigateTo = new NavigationPage(page);
        navigateTo.tooltipPage();
    });
    test('tooltips', async ({page}) => {
        const tooltipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
        await tooltipCard.getByRole('button', { name: 'Top' }).hover();

        // page.getByRole('tooltip') // if your code has that role than you can use this
        const tooltip = await page.locator('nb-tooltip').textContent();
        expect (tooltip).toEqual('This is a tooltip'); // check if the tooltip contains this text
    });
});

test.describe('Dialog Box', () => {
    test.beforeEach(async ({page}) => {
        const navigateTo = new NavigationPage(page);
        navigateTo.smartTablePage();
    });
    test('dialog boxes', async ({page}) => {
        page.on('dialog', dialog => {
           expect(dialog.message()).toEqual('Are you sure you want to delete?');
             dialog.accept(); // create a listener for browser dialog box (prompt, alert, confirm) events and accept or dismiss the dialog
        })

        await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
    });
});
// cypress commands:
/* 
it('...', () => {

  // Queued and executed (slightly) later
  cy.visit('loginTest.html')
  cy.get('#username').type('shahin')
  cy.get('#password').type('tala')
  cy.contains('Login').click() 

  // executed immediately (so actually first line to run)
  cy.on('window:alert', (str) => {
    expect(str).to.equal(`Login Successfully`)
  })
}) 
*/
// cucumber commands:
/* 
// Use a stub to catch the event, and assert the stub properties inside Then().
let stub  // declare outside so it's visible in both When and Then

When('I click on the login button', () => {
  stub = cy.stub()              // set stub here (must be inside a test)
  cy.on('window:alert', stub)   // capture call 
  cy.contains('Login').click()  
})

Then('message is displayed', () => {
  expect(stub).to.have.been.calledWith('Login Successful')
})
*/
test.describe('Table page', () => {
    test.beforeEach(async ({page}) => {
        const navigateTo = new NavigationPage(page);
        navigateTo.smartTablePage();
    });
    test('tables', async ({page}) => {
        // how to get row by any text
        const tableRow = page.getByRole('row', { name: 'twitter@outlook.com'})
        await tableRow.locator('.nb-edit').click(); // click on edit button
        await page.locator('input-editor').getByPlaceholder('Age').clear(); // clear the age input field
        await page.locator('input-editor').getByPlaceholder('Age').fill('35');
        await page.locator('.nb-checkmark').click();
    });

    test('tables - find a row by id', async ({page}) => {
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
        const tableRowById = page.getByRole('row', { name: '11' }).filter({has: page.locator('td').nth(1).getByText('11')});
        await tableRowById.locator('.nb-edit').click();
        await page.locator('input-editor').getByPlaceholder('E-mail').clear(); // clear the age input field
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
        await page.locator('.nb-checkmark').click();
        await expect(tableRowById.locator('td').nth(5)).toHaveText('test@test.com'); // check if the email is updated
    });

    test('tables - filter of the table', async ({page}) => {
        
        const ages =["200", "40", "20", "30"];
        for (let age of ages) {
            await page.locator('input-filter').getByPlaceholder('Age').clear();
            await page.locator('input-filter').getByPlaceholder('Age').fill(age);
            await page.waitForTimeout(500);
               
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found');
            } else {
                expect(await page.getByRole('table').getByRole('cell').last().textContent()).toEqual(age); // check if the cell contains the age
            }
        }
    });
});

test.describe('datepicker page', () => {
    test.beforeEach(async ({page}) => {
        const navigateTo = new NavigationPage(page);
        navigateTo.datePickerPage();
    });
    test('datepickers', async ({page}) => {
        const calendarInputField = page.getByPlaceholder("Form Picker");
        await calendarInputField.click();

        let date = new Date()
        date.setDate(date.getDate() + 14)// 14 days from today
        const expectedDate = date.getDate().toString();
        const expectedMonth = date.toLocaleString('En-US', {month: 'short'});
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'});
        const expectedYear = date.getFullYear();
        const dateToAssert = `${expectedMonth} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
        }
        
        //await page.locator('[class="day-cell ng-star-inserted"]', { hasText: / 1 /i }).click();// .getByText('1', {exact:true})
        //await expect(calendarInputField).toHaveValue('Jul 1, 2025');
        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
        await expect(calendarInputField).toHaveValue(dateToAssert);
    });
});

test.describe('Sliders Page', () => {
    test('sliders', async ({page}) => {
        // first approach: update attribute
        const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');// find the el that moves the slider
        await tempGauge.evaluate( slide => {// first we moved the element
        slide.setAttribute('cx', '232.630');
        slide.setAttribute('cy', '232.630');
       });
       await tempGauge.click();// then we trigger action
    });

    test('sliders 2', async ({page}) => {
        // second approach: mouse movement
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
        await tempBox.scrollIntoViewIfNeeded();// scrool into view
        const box = await tempBox.boundingBox(); //stay inside the boundaries of this slider box
        const x = box.x + box.width / 2;// find the middle
        const y = box.y + box.height / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 100, y);
        await page.mouse.move(x + 100, y + 100);
        await page.mouse.up();

        await expect(tempBox).toContainText('30');
    });
});
