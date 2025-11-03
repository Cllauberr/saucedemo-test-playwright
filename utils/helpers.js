//Carregar dados de fixture JSON
function loadFixture(fixtureName) {
  return require(`../fixtures/${fixtureName}.json`);
}

//Obter produto específico por chave
function getProduct(productKey) {
  return loadFixture('products').products[productKey];
}

//Obter todos os produtos
function getAllProducts() {
  return loadFixture('products').productsList;
}

//Obter dados de checkout aleatórios
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
