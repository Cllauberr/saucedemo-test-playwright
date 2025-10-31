const { test } = require('../../utils/fixtures');
const { expect } = require('@playwright/test');
const { getProduct, getAllProducts, loadFixture } = require('../../utils/helpers');

/**
 * Testes de Produtos
 * Valida navegação e interação com produtos
 */

test.describe('Produtos', () => {
  
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    const messages = loadFixture('messages');
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.page.waitForURL(new RegExp(messages.urls.inventory));
  });

  test('deve exibir todos os produtos na listagem', async ({ productsPage }) => {
    // Arrange
    const expectedProductsCount = getAllProducts().length;

    // Act
    const products = await productsPage.getAllProducts();

    // Assert
    expect(products.length).toBe(expectedProductsCount);
    
    // Validar que todos têm nome, descrição e preço
    products.forEach(product => {
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThan(0);
      expect(product.price).toMatch(/\$\d+\.\d{2}/);
    });
  });

  test('deve adicionar produto ao carrinho da listagem', async ({ productsPage }) => {
    // Arrange
    const product = getProduct('backpack');

    // Act
    await productsPage.addProductToCartByName(product.name);

    // Assert
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
  });

  test('deve adicionar múltiplos produtos ao carrinho', async ({ productsPage }) => {
    // Arrange
    const product1 = getProduct('backpack');
    const product2 = getProduct('bikeLight');
    const product3 = getProduct('boltTShirt');

    // Act
    await productsPage.addProductToCartByName(product1.name);
    await productsPage.addProductToCartByName(product2.name);
    await productsPage.addProductToCartByName(product3.name);

    // Assert
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe('3');
  });

  test('deve navegar para detalhes do produto ao clicar no nome', async ({ productsPage, productDetailPage }) => {
    // Arrange
    const product = getProduct('backpack');
    const messages = loadFixture('messages');

    // Act
    await productsPage.clickProductByName(product.name);

    // Assert
    await expect(productDetailPage.page).toHaveURL(new RegExp(messages.urls.inventoryItem));
    const actualName = await productDetailPage.getProductName();
    expect(actualName).toBe(product.name);
  });

  test('deve validar dados do produto usando fixture', async ({ productsPage, productDetailPage }) => {
    // Arrange
    const expectedProduct = getProduct('backpack');

    // Act
    await productsPage.clickProductByName(expectedProduct.name);
    const productDetails = await productDetailPage.getProductDetails();

    // Assert
    expect(productDetails.name).toBe(expectedProduct.name);
    expect(productDetails.price).toBe(expectedProduct.price);
    expect(productDetails.description).toBe(expectedProduct.description);
  });

  test('deve ordenar produtos por nome (A-Z)', async ({ productsPage }) => {
    // Act
    await productsPage.sortProducts('az');
    const products = await productsPage.getAllProducts();

    // Assert
    const productNames = products.map(p => p.name);
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test('deve ordenar produtos por preço (Low to High)', async ({ productsPage }) => {
    // Act
    await productsPage.sortProducts('lohi');
    const products = await productsPage.getAllProducts();

    // Assert
    const prices = products.map(p => parseFloat(p.price.replace('$', '')));
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });
});
