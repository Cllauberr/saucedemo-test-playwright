const { test } = require('../../utils/fixtures');
const { expect } = require('@playwright/test');
const { USERS } = require('../../config/constants');
const { getProduct, getRandomCheckoutData, loadFixture } = require('../../utils/helpers');

/**
 * Teste E2E completo - Fluxo de Compra no SauceDemo
 * 
 * Cenário: Usuário realiza compra completa de produto
 * Dado que o usuário está na página de login
 * Quando ele faz login com credenciais válidas
 * E navega pelos produtos
 * E seleciona um produto específico
 * E valida informações do produto
 * E adiciona o produto ao carrinho
 * E acessa o carrinho
 * E procede para o checkout
 * E preenche os dados de entrega
 * E finaliza o pedido
 * Então ele deve ver a mensagem de confirmação do pedido
 */

test.describe('Fluxo de Compra E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Arrange: Navegar para a página inicial
    await page.goto('/');
  });

  test('deve completar o fluxo de compra com sucesso', async ({ 
    loginPage, 
    productsPage, 
    productDetailPage, 
    cartPage, 
    checkoutPage 
  }) => {
    // ARRANGE - Preparar dados do teste
    const product = getProduct('backpack');
    const checkoutData = getRandomCheckoutData();
    const messages = loadFixture('messages');
    const urls = messages.urls;

    // ACT & ASSERT - Passo 1: Login
    await test.step('Fazer login na aplicação', async () => {
      await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
      
      // Verificar que login foi bem-sucedido
      await expect(productsPage.page).toHaveURL(new RegExp(urls.inventory));
      expect(await productsPage.isOnProductsPage()).toBeTruthy();
    });

    // ACT & ASSERT - Passo 2: Navegação e Visualização de Produtos
    await test.step('Navegar pela página de produtos', async () => {
      const pageTitle = await productsPage.getPageTitle();
      expect(pageTitle).toBe(messages.pages.products);
      
      // Verificar que produtos estão sendo exibidos
      const products = await productsPage.getAllProducts();
      expect(products.length).toBeGreaterThan(0);
    });

    // ACT & ASSERT - Passo 3: Validação do Produto
    await test.step('Selecionar e validar detalhes do produto', async () => {
      // Clicar no produto
      await productsPage.clickProductByName(product.name);
      
      // Validar URL da página de detalhes
      await expect(productDetailPage.page).toHaveURL(new RegExp(urls.inventoryItem));
      
      // Validar título do produto
      const actualName = await productDetailPage.getProductName();
      expect(actualName).toBe(product.name);
      
      // Validar preço do produto
      const actualPrice = await productDetailPage.getProductPrice();
      expect(actualPrice).toBe(product.price);
      
      // Validar descrição do produto
      const description = await productDetailPage.getProductDescription();
      expect(description).toBe(product.description);
    });

    // ACT & ASSERT - Passo 4: Adicionar ao Carrinho
    await test.step('Adicionar produto ao carrinho', async () => {
      await productDetailPage.addToCart();
      
      // Verificar que badge do carrinho foi atualizado
      const cartCount = await productDetailPage.getCartBadgeCount();
      expect(cartCount).toBe('1');
      
      // Verificar que botão mudou para "Remove"
      expect(await productDetailPage.isProductInCart()).toBeTruthy();
    });

    // ACT & ASSERT - Passo 5: Acessar Carrinho
    await test.step('Acessar o carrinho e validar item', async () => {
      await productDetailPage.goToCart();
      
      // Validar URL do carrinho
      await expect(cartPage.page).toHaveURL(new RegExp(urls.cart));
      expect(await cartPage.isOnCartPage()).toBeTruthy();
      
      // Validar que produto está no carrinho
      expect(await cartPage.isProductInCart(product.name)).toBeTruthy();
      
      // Validar quantidade de itens
      const itemCount = await cartPage.getCartItemsCount();
      expect(itemCount).toBe(1);
      
      // Validar detalhes do item no carrinho
      const cartItems = await cartPage.getCartItems();
      expect(cartItems[0].name).toBe(product.name);
      expect(cartItems[0].price).toBe(product.price);
    });

    // ACT & ASSERT - Passo 6: Checkout - Informações
    await test.step('Preencher informações de checkout', async () => {
      await cartPage.proceedToCheckout();
      
      // Validar que está na página de checkout step 1
      await expect(checkoutPage.page).toHaveURL(new RegExp(urls.checkoutStepOne));
      expect(await checkoutPage.isOnCheckoutStepOne()).toBeTruthy();
      
      // Preencher dados
      await checkoutPage.fillCheckoutInformation(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
      );
      
      await checkoutPage.continue();
    });

    // ACT & ASSERT - Passo 7: Checkout - Overview
    await test.step('Validar resumo do pedido', async () => {
      // Validar que está na página de overview
      await expect(checkoutPage.page).toHaveURL(new RegExp(urls.checkoutStepTwo));
      expect(await checkoutPage.isOnCheckoutOverview()).toBeTruthy();
      
      // Validar itens no resumo
      const orderItems = await checkoutPage.getOrderItems();
      expect(orderItems.length).toBe(1);
      expect(orderItems[0].name).toBe(product.name);
      expect(orderItems[0].price).toBe(product.price);
      
      // Validar cálculos
      const subtotal = await checkoutPage.getSubtotal();
      expect(subtotal).toBe(product.price);
      
      const tax = await checkoutPage.getTax();
      expect(tax).toMatch(/\$\d+\.\d{2}/); // Formato de preço
      
      const total = await checkoutPage.getTotal();
      expect(total).toMatch(/\$\d+\.\d{2}/); // Formato de preço
    });

    // ACT & ASSERT - Passo 8: Finalização do Pedido
    await test.step('Finalizar pedido e validar confirmação', async () => {
      await checkoutPage.finishOrder();
      
      // Validar que está na página de confirmação
      await expect(checkoutPage.page).toHaveURL(new RegExp(urls.checkoutComplete));
      expect(await checkoutPage.isOnCheckoutComplete()).toBeTruthy();
      
      // Validar mensagem de sucesso
      const confirmationMessage = await checkoutPage.getConfirmationMessage();
      expect(confirmationMessage).toBe(messages.messages.orderComplete.header);
      
      const thankYouMessage = await checkoutPage.getThankYouMessage();
      expect(thankYouMessage).toBe(messages.messages.orderComplete.text);
    });
  });
});
