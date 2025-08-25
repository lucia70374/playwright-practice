import {test, expect} from '@playwright/test';

test.describe('test suite 2 @regression', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(process.env.URL)
        await page.getByText('Button Triggering AJAX Request').click() 
    })
    // auto-waiting
    test('auto-waiting', async ({page}) => {
        const successBttn = page.locator('.bg-success')
        // await successBttn.click()
        // await expect(successBttn).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})// timeout 5sec
        await successBttn.waitFor({state: 'attached'}) // wait for the element to be attached to the DOM
        const text = await successBttn.allTextContents()// allTextContent doesn't have auto-waiting like textContent
        expect(text).toContain('Data loaded with AJAX get request.')
    })
    
    // alternative waits
    test('alternative waits', async ({page}) => {
        const successBttn = page.locator('.bg-success')
        await page.waitForSelector('.bg-success') // wait for element
        await page.waitForLoadState('networkidle') // wait for network to be idle - not recomended
        // await page.waitForResponse('http://uitestingplayground.com/ajaxdata') // wait for response
    })
})

test.describe('test suite 3', () => {
    test.beforeEach(async ({page}, testInfo) => {
        await page.goto('http://uitestingplayground.com/ajax')
        await page.getByText('Button Triggering AJAX Request').click() 
        testInfo.setTimeout(testInfo.timeout + 2000) // increase the timeout for this test
    })
    // timeouts
    // test timeout: 30000ms
    // expect timeout: 5000ms
    test('timeouts', async ({page}) => {
        // test.setTimeout(40000) // set test timeout to 40 seconds

        test.slow() // slow down the test execution by 2 seconds
        const successBttn = page.locator('.bg-success')
        await successBttn.click({timeout: 40000})
    })
})