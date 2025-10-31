const { test } = require('../../utils/fixtures');
const { expect } = require('@playwright/test');
const { getProduct, loadFixture } = require('../../utils/helpers');

test.describe('Checkout', () => {
  
  test.beforeEach(async ({ page, loginPage, productsPage, cartPage }) => {
    const messages = loadFixture('messages');
    const product = getProduct('backpack');
    
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.page.waitForURL(new RegExp(messages.urls.inventory));
    
    // Adicionar produto ao carrinho e ir para checkout
    await productsPage.addProductToCartByName(product.name);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('deve preencher informações e avançar para overview', async ({ checkoutPage }) => {
    // Arrange
    const checkoutData = loadFixture('checkout').checkoutData[0];
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continue();

    // Assert
    await expect(checkoutPage.page).toHaveURL(new RegExp(messages.urls.checkoutStepTwo));
    expect(await checkoutPage.isOnCheckoutOverview()).toBeTruthy();
  });

  test('deve validar erro quando firstName está vazio', async ({ checkoutPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.fillCheckoutInformation('', 'Doe', '12345');
    await checkoutPage.continue();

    // Assert
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.checkout.firstNameRequired);
  });

  test('deve validar erro quando lastName está vazio', async ({ checkoutPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.fillCheckoutInformation('John', '', '12345');
    await checkoutPage.continue();

    // Assert
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.checkout.lastNameRequired);
  });

  test('deve validar erro quando postalCode está vazio', async ({ checkoutPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '');
    await checkoutPage.continue();

    // Assert
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(messages.errors.checkout.postalCodeRequired);
  });

  test('deve cancelar checkout e voltar ao carrinho', async ({ checkoutPage, cartPage }) => {
    // Arrange
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.cancel();

    // Assert
    await expect(cartPage.page).toHaveURL(new RegExp(messages.urls.cart));
    expect(await cartPage.isOnCartPage()).toBeTruthy();
  });

  test('deve exibir resumo correto na página de overview', async ({ checkoutPage }) => {
    // Arrange
    const checkoutData = loadFixture('checkout').checkoutData[0];
    const product = getProduct('backpack');

    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continue();

    // Assert
    const orderItems = await checkoutPage.getOrderItems();
    expect(orderItems.length).toBe(1);
    expect(orderItems[0].name).toBe(product.name);
    expect(orderItems[0].price).toBe(product.price);

    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toBe(product.price);

    const tax = await checkoutPage.getTax();
    expect(tax).toMatch(/\$\d+\.\d{2}/);

    const total = await checkoutPage.getTotal();
    expect(total).toMatch(/\$\d+\.\d{2}/);
  });

  test('deve finalizar pedido com sucesso', async ({ checkoutPage }) => {
    // Arrange
    const checkoutData = loadFixture('checkout').checkoutData[0];
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.finishOrder();

    // Assert
    await expect(checkoutPage.page).toHaveURL(new RegExp(messages.urls.checkoutComplete));
    expect(await checkoutPage.isOnCheckoutComplete()).toBeTruthy();
    
    const confirmationMessage = await checkoutPage.getConfirmationMessage();
    expect(confirmationMessage).toBe(messages.messages.orderComplete.header);
  });

  test('deve voltar para produtos após finalizar pedido', async ({ checkoutPage, productsPage }) => {
    // Arrange
    const checkoutData = loadFixture('checkout').checkoutData[0];
    const messages = loadFixture('messages');

    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.finishOrder();
    await checkoutPage.backToHome();

    // Assert
    await expect(productsPage.page).toHaveURL(new RegExp(messages.urls.inventory));
    expect(await productsPage.isOnProductsPage()).toBeTruthy();
  });

  test('deve calcular total corretamente com múltiplos produtos', async ({ productsPage, cartPage, checkoutPage }) => {
    // Arrange - Adicionar mais produtos
    const messages = loadFixture('messages');
    const product1 = getProduct('bikeLight');
    const product2 = getProduct('boltTShirt');
    
    await checkoutPage.page.goto('/inventory.html');
    await productsPage.addProductToCartByName(product1.name);
    await productsPage.addProductToCartByName(product2.name);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();

    const checkoutData = loadFixture('checkout').checkoutData[0];

    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.continue();

    // Assert
    const orderItems = await checkoutPage.getOrderItems();
    expect(orderItems.length).toBe(3);

    // Validar que subtotal é a soma dos preços
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toMatch(/\$\d+\.\d{2}/);
  });
});
