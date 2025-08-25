import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{
    /*
    When a class is extended, it inherits properties and methods from its parent (or super) class. This means the extended class can use the functionality defined in the parent class (HelperBase in this case), effectively taking over the parent's capabilities and adding its own unique features or modifying existing ones.

    Inheritance:
    The extends keyword in languages like Java or JavaScript is used to create a subclass that inherits from a superclass. 
    Code Reuse:
    The subclass doesn't have to rewrite the code from the superclass; it automatically gains access to its members (fields and methods). */ 

    readonly formLayoutsMenuItem: Locator;// remove selectors from the methods and insert fixture Locator
    readonly datePickerMenuItem: Locator;// some don't like to complicate by putting selectors in constractor, because of clogging the page.
    readonly smartTableMenuItem: Locator;// if we don't take locators/selectors from our methods we would erase this readonly and all from constructor except super(page)
    readonly toasterMenuItem: Locator;
    readonly tooltipMenuItem: Locator;

    constructor(page: Page) {
        super(page)
        this.formLayoutsMenuItem = page.getByText('Form Layouts');
        this.datePickerMenuItem = page.getByText('Datepicker');
        this.smartTableMenuItem = page.getByText('Smart Table');
        this.toasterMenuItem = page.getByText('Toastr');
        this.tooltipMenuItem = page.getByText('Tooltip');
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms');
        await this.formLayoutsMenuItem.click();
        await this.waitForNumberOfSeconds(2);
    }

    
    async datePickerPage() {
        await this.selectGroupMenuItem('Forms');
        await this.datePickerMenuItem.click();
    };

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data');
        await this.smartTableMenuItem.click();
    };

    async toasterPage() {
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.toasterMenuItem.click();
    };

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.tooltipMenuItem.click();
    };

    private async selectGroupMenuItem(groupItemTitle: string) {// internal, private method
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');
        if(expandedState == "false") {
            await groupMenuItem.click();
        }

    }
}
