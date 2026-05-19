import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async expectProductInCart(productName: string) {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async proceedToCheckout() {
    await this.page.getByTestId('checkout').click();
  }
}
