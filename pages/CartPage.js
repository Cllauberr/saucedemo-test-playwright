const BasePage = require('./BasePage');
const elements = require('../page-elements/CartPageElements');

/**
 * CartPage - Page Object para a página do carrinho
 */
class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.elements = elements;
  }

  /**
   * Verificar se está na página do carrinho
   * @returns {Promise<boolean>}
   */
  async isOnCartPage() {
    const title = await this.getText(this.elements.pageTitle);
    return title === 'Your Cart';
  }

  /**
   * Obter todos os itens do carrinho
   * @returns {Promise<Array>}
   */
  async getCartItems() {
    const items = await this.page.$$(this.elements.cartItem);
    const cartItems = [];

    for (const item of items) {
      const name = await item.$eval(this.elements.cartItemName, el => el.textContent);
      const description = await item.$eval(this.elements.cartItemDesc, el => el.textContent);
      const price = await item.$eval(this.elements.cartItemPrice, el => el.textContent);
      const quantity = await item.$eval(this.elements.cartQuantity, el => el.textContent);
      
      cartItems.push({ name, description, price, quantity });
    }

    return cartItems;
  }

  /**
   * Obter quantidade de itens no carrinho
   * @returns {Promise<number>}
   */
  async getCartItemsCount() {
    const items = await this.page.$$(this.elements.cartItem);
    return items.length;
  }

  /**
   * Verificar se produto está no carrinho pelo nome
   * @param {string} productName - Nome do produto
   * @returns {Promise<boolean>}
   */
  async isProductInCart(productName) {
    const items = await this.getCartItems();
    return items.some(item => item.name === productName);
  }

  /**
   * Remover item do carrinho pelo nome
   * @param {string} productName - Nome do produto
   */
  async removeProductByName(productName) {
    const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    const buttonSelector = `[data-test="remove-${productId}"]`;
    await this.click(buttonSelector);
  }

  /**
   * Continuar comprando
   */
  async continueShopping() {
    await this.click(this.elements.continueShoppingButton);
  }

  /**
   * Ir para checkout
   */
  async proceedToCheckout() {
    await this.click(this.elements.checkoutButton);
  }

  /**
   * Verificar se carrinho está vazio
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    const count = await this.getCartItemsCount();
    return count === 0;
  }
}

module.exports = CartPage;
