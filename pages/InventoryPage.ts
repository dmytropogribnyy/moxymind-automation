import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortSelect: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async addProductToCart(productId: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async removeProductFromCart(productId: string): Promise<void> {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
