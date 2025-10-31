const BasePage = require('./BasePage');
const elements = require('../page-elements/ProductsPageElements');

//ProductsPage - Page Object para a página de produtos
class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.elements = elements;
  }

  //Verificar se está na página de produtos
  async isOnProductsPage() {
    return await this.isVisible(this.elements.inventoryContainer);
  }

  //Obter título da página
  async getPageTitle() {
    return await this.getText(this.elements.pageTitle);
  }

  //Obter descrição da página
  async getPageDescription() {
    return await this.getText(this.elements.pageDescription);
  }

  //Obter imagem da página
  async getPageImage() {
    return await this.getAttribute(this.elements.pageImage, 'src');
  }

  //Obter lista de todos os produtos
  async getAllProducts() {
    const products = await this.page.$$(this.elements.inventoryItem);
    const productList = [];

    for (const product of products) {
      const name = await product.$eval(this.elements.inventoryItemName, el => el.textContent);
      const description = await product.$eval(this.elements.inventoryItemDesc, el => el.textContent);
      const price = await product.$eval(this.elements.inventoryItemPrice, el => el.textContent);
      
      productList.push({ name, description, price });
    }

    return productList;
  }

  //Clicar em um produto específico pelo nome
  async clickProductByName(productName) {
    await this.page.click(`text=${productName}`);
  }

  //A dicionar produto ao carrinho pelo nome
  async addProductToCartByName(productName) {
    // Converter nome do produto para o formato do data-test
    const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    const buttonSelector = `[data-test="add-to-cart-${productId}"]`;
    await this.click(buttonSelector);
  }

  //Obter quantidade de itens no carrinho

  async getCartBadgeCount() {
    const isVisible = await this.isVisible(this.elements.shoppingCartBadge);
    if (!isVisible) return '0';
    return await this.getText(this.elements.shoppingCartBadge);
  }

  // Obter elemento do badge do carrinho

  async getCartBadge() {
    return this.page.locator(this.elements.shoppingCartBadge);
  }

  // Obter imagem de um produto específico pelo nome

  async getProductImage(productName) {
    // Encontrar o item do produto pelo nome
    const productItem = this.page.locator(this.elements.inventoryItem)
      .filter({ hasText: productName });
    
    // Retornar a imagem dentro desse item
    return productItem.locator('.inventory_item_img img');
  }

  // Clicar no ícone do carrinho
  async goToCart() {
    await this.click(this.elements.shoppingCartLink);
  }

  // Ordenar produtos
  async sortProducts(option) {
    await this.page.selectOption(this.elements.productSortContainer, option);
  }

  // Fazer logout
  async logout() {
    await this.click(this.elements.burgerMenu);
    await this.waitForElement(this.elements.logoutLink);
    await this.click(this.elements.logoutLink);
  }
}

module.exports = ProductsPage;
