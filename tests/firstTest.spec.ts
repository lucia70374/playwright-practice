import {test, expect} from '@playwright/test';

test.describe('test suite 1 @smoke', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })
    
    test.skip('locator syntax rules', async ({page}) => {
        // by tag name
        await page.locator('input').first().click()

        // by id
        page.locator('#inputEmail1')

        // by class name
        page.locator('.shape-rectangle')

        // by attribute
        page.locator('[placeholder="Email"]')

        // by full class value
        page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

        // combined locators - no space between
        page.locator('input[placeholder="Email"][nbinput]')

        // by xpath (not recommended)
        page.locator('//input[@id="inputEmail1"]')

        // by partial text
        page.locator(':text("Using")')

        // by exact text
        page.locator(':text("Using the Grid")')
    })

    test('user fasing locators', async ({page}) => {
        await page.getByRole('textbox', {name: "Email"}).first().click()
        await page.getByRole('button', {name: "Sign in"}).first().click()
        await page.getByLabel('Email').first().click()
        await page.getByPlaceholder('Jane Doe').click()
        //getByTitle, getByText...
    })

    test('locating child elements', async ({page}) => {
        // by child element - separate your locators with a space
        await page.locator('nb-card nb-radio :text-is("Option 1")').click()
        // by chaining locators
        await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
        await page.locator('nb-card').getByRole('button', {name: "Sign in"}).last().click()
        // by index 0, 1, 2, 3...
        await page.locator('nb-card').nth(3).getByRole('button').click()
    })

    test('locate parent elements', async ({page}) => {

        // by parent element
        await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
        await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()
        // by filter method
        await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
        await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()
        // by chaining filter methods
        await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()
        // by using 'one level up' - locator('..') - not recomended
        await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
    })

    test('reusing locators', async ({page}) => {
        // assign locator to a variable
        const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
        const emailField = basicForm.getByRole('textbox', {name: "Email address"})

        await emailField.fill('test@test.com')
        await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
        await basicForm.locator('nb-checkbox').click()
        await basicForm.getByRole('button').click()
        //assertions
        await expect(emailField).toHaveValue('test@test.com')
    })

    test('extracting values', async ({page}) => {
        //single text value
        const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
        const buttonText = await basicForm.locator('button').textContent()
        expect(buttonText).toEqual('Submit')

        //all Text values
        const allRadioBttn = await page.locator('nb-radio').allTextContents()
        expect(allRadioBttn).toContain('Option 1')

        //input value
        const emailField = basicForm.getByRole('textbox', {name: "Email"})
        await emailField.fill('test@test.com')
        const emailValue = await emailField.inputValue()
        expect(emailValue).toEqual('test@test.com')

        const placeholderValue = await emailField.getAttribute('placeholder')
        expect(placeholderValue).toEqual("Email")
    })

    // assertions
    test('assertions', async ({page}) => {
        const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
        // general assertions don't wait for the element to be present
        const value = 5
        expect(value).toBe(5)

        const text = await basicFormButton.textContent()
        expect(text).toEqual('Submit')

        //locator assertions has timeout of 5s
        await expect(basicFormButton).toHaveText('Submit')

        //soft assertions if it fails, it will continue the test
        await expect.soft(basicFormButton).toHaveText('Submit3')
        await basicFormButton.click()
    })
})
