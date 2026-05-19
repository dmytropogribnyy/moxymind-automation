// Note: comments are included for demo/interview purposes
// In a real project, well-named tests are usually self-documenting
import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../test-data/users';

test.describe('Authentication', { tag: '@ui' }, () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).goto();
  });

  test('should login successfully with a valid standard user', async ({
    page,
  }) => {
    /**
     * Login is the entry point of the entire application.
     * Without successful authentication, no other functionality is accessible.
     * A broken login = 100% of users blocked.
     */
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.loginAsStandardUser();

    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should show an error when a locked out user tries to login', async ({
    page,
  }) => {
    /**
     * Validates access control and error handling.
     * Blocked users must be denied with a clear message and must not enter the app.
     */
    const loginPage = new LoginPage(page);

    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await loginPage.expectErrorMessage('locked out');
    await loginPage.expectToStayOnLoginPage();
  });
});
