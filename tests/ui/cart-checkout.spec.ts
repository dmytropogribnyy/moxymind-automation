import { test, expect } from '../../fixtures/test';
import { products, validCustomer } from '../../test-data/products';
import { users } from '../../test-data/users';

const priceFromText = (value: string): number => Number.parseFloat(value.replace('$', ''));

test.describe('Cart and checkout journeys', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test(
    'cart state reflects add and remove actions',
    { tag: ['@ui', '@regression'] },
    async ({ inventoryPage }) => {
      await inventoryPage.addProductToCart(products.backpack.id);
      await expect(inventoryPage.cartBadge).toHaveText('1');

      await inventoryPage.removeProductFromCart(products.backpack.id);
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    },
  );

  test(
    'inventory can be sorted by price from low to high',
    { tag: ['@ui', '@regression'] },
    async ({ inventoryPage }) => {
      await inventoryPage.sortBy('lohi');

      const prices = (await inventoryPage.productPrices.allTextContents()).map(priceFromText);
      expect(prices.length).toBeGreaterThan(1);
      expect(prices).toEqual([...prices].sort((left, right) => left - right));
    },
  );

  test(
    'checkout blocks missing required customer information',
    { tag: ['@ui', '@regression'] },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addProductToCart(products.backpack.id);
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();

      await checkoutPage.submitCustomerDetails({ ...validCustomer, firstName: '' });

      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    },
  );

  test(
    'critical purchase journey completes with a consistent order summary',
    { tag: ['@ui', '@smoke', '@critical'] },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      await test.step('Add the selected product and verify cart state', async () => {
        await inventoryPage.addProductToCart(products.backpack.id);
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await inventoryPage.openCart();
        await expect(cartPage.productName(products.backpack.name)).toBeVisible();
        await expect(cartPage.productPrice(products.backpack.name)).toHaveText(
          `$${products.backpack.price}`,
        );
      });

      await test.step('Provide customer details and review totals', async () => {
        await cartPage.proceedToCheckout();
        await checkoutPage.submitCustomerDetails(validCustomer);

        await expect(checkoutPage.summaryProduct(products.backpack.name)).toBeVisible();
        await expect(checkoutPage.itemTotal).toHaveText(`Item total: $${products.backpack.price}`);
        await expect(checkoutPage.tax).toContainText('Tax: $');
        await expect(checkoutPage.total).toContainText('Total: $');
      });

      await test.step('Finish the order and confirm completion', async () => {
        await checkoutPage.finishOrder();
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      });
    },
  );
});
