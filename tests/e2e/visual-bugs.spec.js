const { test } = require('../../utils/fixtures');
const { expect } = require('@playwright/test');
const { USERS } = require('../../config/constants');
const { getProduct, loadFixture } = require('../../utils/helpers');
const {
  compareProductImages,
  captureCartBadge,
  inspectAllProductImages,
  captureFullPageComparison,
  compareButtonPositions,
  analyzePriceAlignment
} = require('../../utils/visual-helpers');

test.describe('Bugs Visuais - visual_user', () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    const messages = loadFixture('messages');
    
    // Fazer login com visual_user
    await page.goto('/');
    await loginPage.login(USERS.VISUAL.username, USERS.VISUAL.password);
    await productsPage.page.waitForURL(new RegExp(messages.urls.inventory));
  });

  test('deve detectar imagem incorreta do produto Sauce Labs Backpack', async ({ page, loginPage, productsPage }) => {
    const product = getProduct('backpack');
    
    // Comparar imagens entre visual_user e standard_user
    const imageSources = await compareProductImages(page, loginPage, productsPage, product.name);
    
    // As imagens devem ser diferentes (bug visual detectado)
    expect(imageSources.visualUser).not.toBe(imageSources.standardUser);
  });

  test('deve detectar problemas visuais no ícone do carrinho', async ({ page, productsPage }) => {
    const product = getProduct('backpack');
    
    // Capturar badge do carrinho após adicionar produto
    const cartBadgeData = await captureCartBadge(page, productsPage, product.name);
    
    // Validações
    await expect(cartBadgeData.locator).toBeVisible();
    expect(cartBadgeData.text).toBe('1');
  });

  test('deve verificar imagens de todos os produtos com visual_user', async ({ page }) => {
    // Inspecionar todas as imagens dos produtos
    const products = await inspectAllProductImages(page);
    
    // Validações
    expect(products).toHaveLength(6);
    products.forEach(async (product) => {
      await expect(product.locator).toBeVisible();
    });
  });

  test('deve comparar layout da página entre standard_user e visual_user', async ({ page, loginPage, productsPage }) => {
    // Capturar screenshots full-page de ambos os usuários
    await captureFullPageComparison(page, loginPage, productsPage);
  });

  test('deve verificar posicionamento dos botões Add to Cart', async ({ page, loginPage, productsPage }) => {
    // Comparar posições dos botões entre visual_user e standard_user
    const comparison = await compareButtonPositions(page, loginPage, productsPage);
    
    // Validar que foram encontrados botões
    expect(comparison.visualUser.length).toBeGreaterThan(0);
    expect(comparison.standardUser.length).toBe(comparison.visualUser.length);
  });

  test('deve verificar alinhamento de preços dos produtos', async ({ page }) => {
    // Analisar alinhamento dos preços
    const priceAnalysis = await analyzePriceAlignment(page);
    
    // Validações
    expect(priceAnalysis.prices).toHaveLength(6);
    expect(priceAnalysis.maxDifference).toBeGreaterThan(0);
  });
});
