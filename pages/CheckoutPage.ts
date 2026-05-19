import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByTestId('firstName').fill(firstName);
    await this.page.getByTestId('lastName').fill(lastName);
    await this.page.getByTestId('postalCode').fill(postalCode);
    await this.page.getByTestId('continue').click();
  }

  async finishOrder() {
    await this.page.getByTestId('finish').click();
  }

  async expectOrderConfirmation() {
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  }
}
