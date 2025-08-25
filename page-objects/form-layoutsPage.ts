import { Page } from '@playwright/test'
export class FormLayoutsPage {
    private readonly page: Page;// this class can't be extended because its private, but can extend to a parent class that's not private and it will loose its private declaration

    constructor(page: Page) {
        this.page = page;
    }

    async submitUsingTheGridFormWithCrendentiailsAndSelectOption(email: string, password: string, optionText: string) {//three params.
        const gridForm = this.page.locator('nb-card', { hasText: 'Using the Grid' });
        await gridForm.getByRole('textbox', { name: 'Email' }).fill(email);
        await gridForm.getByRole('textbox', { name: 'Password' }).fill(password);
        await gridForm.getByRole('radio', { name: optionText }).check({force: true});
        await gridForm.getByRole('button').click();
    }

    /**
     * This method fills out Inline form with user detailes
     * @param name - first and last name
     * @param email -valid email
     * @param checkbox -true to check or false to uncheck 
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string,  checkbox: boolean) {//three params.
        const inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' });
        await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(name);
        await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email);
        if(checkbox){
            await inlineForm.getByRole('checkbox', { name: 'Remember me' }).check({force: true});
        }
        await inlineForm.getByRole('button').click();
    }
}