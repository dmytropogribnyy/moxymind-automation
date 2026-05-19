import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async expectToBeOnInventoryPage() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }

  async addProductToCart(productTestId: string) {
    await this.page.getByTestId(`add-to-cart-${productTestId}`).click();
  }

  async removeProductFromCart(productTestId: string) {
    await this.page.getByTestId(`remove-${productTestId}`).click();
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.page.getByTestId('shopping-cart-badge')).toHaveText(
      String(count),
    );
  }

  async expectCartBadgeHidden() {
    await expect(
      this.page.getByTestId('shopping-cart-badge'),
    ).not.toBeVisible();
  }
}
