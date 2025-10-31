const BasePage = require('./BasePage');
const elements = require('../page-elements/ProductDetailPageElements');

/**
 * ProductDetailPage - Page Object para a página de detalhes do produto
 */
class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.elements = elements;
  }

  /**
   * Obter nome do produto
   * @returns {Promise<string>}
   */
  async getProductName() {
    return await this.getText(this.elements.productName);
  }

  /**
   * Obter descrição do produto
   * @returns {Promise<string>}
   */
  async getProductDescription() {
    return await this.getText(this.elements.productDescription);
  }

  /**
   * Obter preço do produto
   * @returns {Promise<string>}
   */
  async getProductPrice() {
    return await this.getText(this.elements.productPrice);
  }

  /**
   * Obter todos os detalhes do produto
   * @returns {Promise<Object>}
   */
  async getProductDetails() {
    const name = await this.getProductName();
    const description = await this.getProductDescription();
    const price = await this.getProductPrice();
    
    return { name, description, price };
  }

  /**
   * Adicionar produto ao carrinho
   */
  async addToCart() {
    await this.page.click(this.elements.addToCartButton);
  }

  /**
   * Verificar se produto foi adicionado ao carrinho
   * @returns {Promise<boolean>}
   */
  async isProductInCart() {
    return await this.isVisible(this.elements.removeButton);
  }

  /**
   * Voltar para a página de produtos
   */
  async goBackToProducts() {
    await this.click(this.elements.backButton);
  }

  /**
   * Ir para o carrinho
   */
  async goToCart() {
    await this.click(this.elements.shoppingCartLink);
  }

  /**
   * Obter quantidade de itens no carrinho
   * @returns {Promise<string>}
   */
  async getCartBadgeCount() {
    const isVisible = await this.isVisible(this.elements.shoppingCartBadge);
    if (!isVisible) return '0';
    return await this.getText(this.elements.shoppingCartBadge);
  }
}

module.exports = ProductDetailPage;
