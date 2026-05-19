// Note: comments are included for demo/interview purposes
// In a real project, well-named tests are usually self-documenting
import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const PRODUCT_ID = 'sauce-labs-backpack';
const PRODUCT_NAME = 'Sauce Labs Backpack';

test.describe('Cart and Checkout', { tag: '@ui' }, () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('should add and remove a product from the cart', async ({ page }) => {
    /**
     * Cart management is the core e-commerce interaction.
     * Users must be able to add items, see the badge update, and remove them.
     * A broken cart = users cannot buy anything.
     */
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart(PRODUCT_ID);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.removeProductFromCart(PRODUCT_ID);
    await inventoryPage.expectCartBadgeHidden();
  });

  test('should complete the checkout flow successfully', async ({ page }) => {
    /**
     * End-to-end checkout is the primary business flow of the application.
     * It covers the full user journey: add product → cart → info → summary → confirmation.
     * A broken checkout = direct and immediate revenue loss.
     */
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart(PRODUCT_ID);
    await inventoryPage.openCart();

    await cartPage.expectProductInCart(PRODUCT_NAME);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishOrder();

    await checkoutPage.expectOrderConfirmation();
  });
});
