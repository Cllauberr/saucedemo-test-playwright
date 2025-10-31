/**
 * Helper functions para testes
 */

/**
 * Carregar dados de fixture JSON
 * @param {string} fixtureName - Nome do arquivo fixture (sem extensão)
 * @returns {Object} Dados do fixture
 */
function loadFixture(fixtureName) {
  return require(`../fixtures/${fixtureName}.json`);
}

/**
 * Obter produto específico por chave
 * @param {string} productKey - Chave do produto (ex: 'backpack', 'bikeLight')
 * @returns {Object} Produto
 */
function getProduct(productKey) {
  return loadFixture('products').products[productKey];
}

/**
 * Obter todos os produtos
 * @returns {Array} Lista de produtos
 */
function getAllProducts() {
  return loadFixture('products').productsList;
}

/**
 * Obter dados de checkout aleatórios
 * @returns {Object} Dados de checkout
 */
function getRandomCheckoutData() {
  const checkoutData = loadFixture('checkout').checkoutData;
  const randomIndex = Math.floor(Math.random() * checkoutData.length);
  return checkoutData[randomIndex];
}

module.exports = {
  loadFixture,
  getProduct,
  getAllProducts,
  getRandomCheckoutData
};
