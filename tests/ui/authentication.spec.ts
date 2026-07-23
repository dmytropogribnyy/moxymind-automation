import { test, expect } from '../../fixtures/test';
import { users } from '../../test-data/users';

test.describe('Authentication controls', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'standard user can access the inventory',
    { tag: ['@ui', '@smoke', '@critical'] },
    async ({ page, loginPage, inventoryPage }) => {
      await test.step('Authenticate with a valid retail account', async () => {
        await loginPage.login(users.standard.username, users.standard.password);
      });

      await test.step('Confirm the protected inventory is available', async () => {
        await expect(page).toHaveURL(/inventory\.html$/);
        await expect(inventoryPage.title).toHaveText('Products');
      });
    },
  );

  test(
    'locked-out user is denied access with a clear message',
    { tag: ['@ui', '@regression'] },
    async ({ page, loginPage }) => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);

      await expect(loginPage.errorMessage).toContainText('locked out');
      await expect(page).toHaveURL('/');
    },
  );

  test(
    'logout clears the authenticated session',
    { tag: ['@ui', '@regression'] },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(users.standard.username, users.standard.password);
      await expect(inventoryPage.title).toHaveText('Products');

      await inventoryPage.logout();

      await expect(page).toHaveURL('/');
      await expect(loginPage.loginButton).toBeVisible();

      await page.goto('/inventory.html');
      await expect(loginPage.loginButton).toBeVisible();
      await expect(page).toHaveURL('/');
    },
  );
});
