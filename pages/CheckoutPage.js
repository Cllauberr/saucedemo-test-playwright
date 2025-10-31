const BasePage = require('./BasePage');
const elements = require('../page-elements/CheckoutPageElements');

/**
 * CheckoutPage - Page Object para as páginas de checkout
 */
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.elements = elements;
  }

  /**
   * Verificar se está na página de checkout step one
   * @returns {Promise<boolean>}
   */
  async isOnCheckoutStepOne() {
    const title = await this.getText(this.elements.pageTitle);
    return title === 'Checkout: Your Information';
  }

  /**
   * Preencher informações do checkout
   * @param {string} firstName - Primeiro nome
   * @param {string} lastName - Sobrenome
   * @param {string} postalCode - CEP/Código Postal
   */
  async fillCheckoutInformation(firstName, lastName, postalCode) {
    await this.fill(this.elements.firstNameInput, firstName);
    await this.fill(this.elements.lastNameInput, lastName);
    await this.fill(this.elements.postalCodeInput, postalCode);
  }

  /**
   * Continuar para o próximo passo
   */
  async continue() {
    await this.click(this.elements.continueButton);
  }

  /**
   * Cancelar checkout
   */
  async cancel() {
    await this.click(this.elements.cancelButton);
  }

  /**
   * Verificar se mensagem de erro está visível
   * @returns {Promise<boolean>}
   */
  async isErrorMessageVisible() {
    return await this.isVisible(this.elements.errorMessage);
  }

  /**
   * Obter texto da mensagem de erro
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return await this.getText(this.elements.errorMessage);
  }

  /**
   * Verificar se está na página de checkout overview (step two)
   * @returns {Promise<boolean>}
   */
  async isOnCheckoutOverview() {
    const title = await this.getText(this.elements.pageTitle);
    return title === 'Checkout: Overview';
  }

  /**
   * Obter itens do resumo do pedido
   * @returns {Promise<Array>}
   */
  async getOrderItems() {
    const items = await this.page.$$(this.elements.cartItem);
    const orderItems = [];

    for (const item of items) {
      const name = await item.$eval(this.elements.cartItemName, el => el.textContent);
      const description = await item.$eval(this.elements.cartItemDesc, el => el.textContent);
      const price = await item.$eval(this.elements.cartItemPrice, el => el.textContent);
      
      orderItems.push({ name, description, price });
    }

    return orderItems;
  }

  /**
   * Obter subtotal do pedido
   * @returns {Promise<string>}
   */
  async getSubtotal() {
    const text = await this.getText(this.elements.summarySubtotal);
    return text.replace('Item total: ', '');
  }

  /**
   * Obter valor da taxa
   * @returns {Promise<string>}
   */
  async getTax() {
    const text = await this.getText(this.elements.summaryTax);
    return text.replace('Tax: ', '');
  }

  /**
   * Obter total do pedido
   * @returns {Promise<string>}
   */
  async getTotal() {
    const text = await this.getText(this.elements.summaryTotal);
    return text.replace('Total: ', '');
  }

  /**
   * Obter resumo completo do pedido
   * @returns {Promise<Object>}
   */
  async getOrderSummary() {
    const items = await this.getOrderItems();
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    
    return { items, subtotal, tax, total };
  }

  /**
   * Finalizar pedido
   */
  async finishOrder() {
    await this.click(this.elements.finishButton);
  }

  /**
   * Verificar se está na página de confirmação
   * @returns {Promise<boolean>}
   */
  async isOnCheckoutComplete() {
    return await this.isVisible(this.elements.completeHeader);
  }

  /**
   * Obter mensagem de confirmação
   * @returns {Promise<string>}
   */
  async getConfirmationMessage() {
    return await this.getText(this.elements.completeHeader);
  }

  /**
   * Obter texto de agradecimento
   * @returns {Promise<string>}
   */
  async getThankYouMessage() {
    return await this.getText(this.elements.completeText);
  }

  /**
   * Voltar para a página inicial
   */
  async backToHome() {
    await this.click(this.elements.backHomeButton);
  }
}

module.exports = CheckoutPage;
