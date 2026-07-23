import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    this.checkoutButton = page.getByTestId('checkout');
    this.cartItems = page.getByTestId('inventory-item');
  }

  productName(name: string): Locator {
    return this.page.getByTestId('inventory-item-name').filter({ hasText: name });
  }

  productPrice(name: string): Locator {
    return this.page
      .getByTestId('inventory-item')
      .filter({ hasText: name })
      .getByTestId('inventory-item-price');
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
