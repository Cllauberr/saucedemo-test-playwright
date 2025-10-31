const { test } = require('../../utils/fixtures');
const { expect } = require('@playwright/test');
const { USERS } = require('../../config/constants');
const { loadFixture } = require('../../utils/helpers');

test.describe('Login', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve fazer login com sucesso usando standard_user', async ({ loginPage, productsPage }) => {
    // Arrange
    const { username, password } = USERS.STANDARD;
    const messages = loadFixture('messages');

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(productsPage.page).toHaveURL(new RegExp(messages.urls.inventory));
    expect(await productsPage.isOnProductsPage()).toBeTruthy();
    expect(await productsPage.getPageTitle()).toBe(messages.pages.products);
  });

  test('deve exibir erro ao tentar login com usuário bloqueado', async ({ loginPage }) => {
    // Arrange
    const { username, password } = USERS.LOCKED_OUT;
    const messages = loadFixture('messages');

    // Act
    await loginPage.login(username, password);

    // Assert
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.login.lockedOut);
  });

  test('deve exibir erro ao fazer login sem username', async ({ loginPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await loginPage.login('', 'secret_sauce');

    // Assert
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.login.usernameRequired);
  });

  test('deve exibir erro ao fazer login sem password', async ({ loginPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await loginPage.login('standard_user', '');

    // Assert
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.login.passwordRequired);
  });

  test('deve exibir erro ao fazer login com credenciais inválidas', async ({ loginPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await loginPage.login('invalid_user', 'wrong_password');

    // Assert
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.login.invalidCredentials);
  });
});
