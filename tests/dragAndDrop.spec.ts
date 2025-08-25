import {expect} from '@playwright/test';
import {test} from '../testOptions';

test.describe('Drag and Drop with Iframe @smoke', () => {
    test.beforeEach(async ({page, globalQaURL}) => {
        await page.goto(globalQaURL);
    });
    test('drag and drop', async ({page}) => {
        const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');// find an iframe
        await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'));// drag the image
        // another example with mouse movements and hover()
        await frame.locator('li', {hasText: "High Tatras 4"}).hover();
        await page.mouse.down();
        await frame.locator('#trash').hover();
        await page.mouse.up();

        await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"]);
    });
});