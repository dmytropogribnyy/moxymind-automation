import { Page, expect } from '@playwright/test';
import { users } from '../test-data/users';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
  }

  async loginAsStandardUser() {
    await this.login(users.standard.username, users.standard.password);
  }

  async expectErrorMessage(text: string) {
    await expect(this.page.getByTestId('error')).toContainText(text);
  }

  async expectToStayOnLoginPage() {
    await expect(this.page).toHaveURL('/');
  }
}
