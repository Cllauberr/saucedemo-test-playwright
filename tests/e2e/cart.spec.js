const { test } = require('../../utils/fixtures');
const { expect } = require('@playwright/test');
const { getProduct, loadFixture } = require('../../utils/helpers');

/**
 * Testes de Carrinho
 * Valida funcionalidades do carrinho de compras
 */

test.describe('Carrinho', () => {
  
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    const messages = loadFixture('messages');
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.page.waitForURL(new RegExp(messages.urls.inventory));
  });

  test('deve adicionar produto ao carrinho e validar no carrinho', async ({ productsPage, cartPage }) => {
    // Arrange
    const product = getProduct('backpack');

    // Act
    await productsPage.addProductToCartByName(product.name);
    await productsPage.goToCart();

    // Assert
    expect(await cartPage.isOnCartPage()).toBeTruthy();
    expect(await cartPage.isProductInCart(product.name)).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('deve adicionar múltiplos produtos e validar no carrinho', async ({ productsPage, cartPage }) => {
    // Arrange
    const product1 = getProduct('backpack');
    const product2 = getProduct('bikeLight');
    const product3 = getProduct('boltTShirt');
    const products = [product1, product2, product3];

    // Act
    for (const product of products) {
      await productsPage.addProductToCartByName(product.name);
    }
    await productsPage.goToCart();

    // Assert
    expect(await cartPage.getCartItemsCount()).toBe(3);
    for (const product of products) {
      expect(await cartPage.isProductInCart(product.name)).toBeTruthy();
    }
  });

  test('deve remover produto do carrinho', async ({ productsPage, cartPage }) => {
    // Arrange
    const product = getProduct('backpack');

    // Act
    await productsPage.addProductToCartByName(product.name);
    await productsPage.goToCart();
    await cartPage.removeProductByName(product.name);

    // Assert
    expect(await cartPage.isCartEmpty()).toBeTruthy();
    expect(await cartPage.isProductInCart(product.name)).toBeFalsy();
  });

  test('deve continuar comprando e voltar para produtos', async ({ productsPage, cartPage }) => {
    // Arrange
    const product = getProduct('backpack');
    const messages = loadFixture('messages');

    // Act
    await productsPage.addProductToCartByName(product.name);
    await productsPage.goToCart();
    await cartPage.continueShopping();

    // Assert
    await expect(productsPage.page).toHaveURL(new RegExp(messages.urls.inventory));
    expect(await productsPage.isOnProductsPage()).toBeTruthy();
  });

  test('deve validar informações dos itens no carrinho', async ({ productsPage, cartPage }) => {
    // Arrange
    const product = getProduct('backpack');

    // Act
    await productsPage.addProductToCartByName(product.name);
    await productsPage.goToCart();
    const cartItems = await cartPage.getCartItems();

    // Assert
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].name).toBe(product.name);
    expect(cartItems[0].price).toBe(product.price);
    expect(cartItems[0].quantity).toBe('1');
    expect(cartItems[0].description).toBe(product.description);
  });

  test('carrinho vazio deve permitir ir para checkout mas exibir página vazia', async ({ productsPage, cartPage }) => {
    // Act
    await productsPage.goToCart();

    // Assert
    expect(await cartPage.isOnCartPage()).toBeTruthy();
    expect(await cartPage.isCartEmpty()).toBeTruthy();
  });
});
