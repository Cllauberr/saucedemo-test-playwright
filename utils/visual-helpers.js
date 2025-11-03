const { USERS } = require('../config/constants');

//Capturar imagem de produto e seu src

async function captureProductImage(productsPage, productName, screenshotPath) {
  const productImage = await productsPage.getProductImage(productName);
  await productImage.screenshot({ path: screenshotPath });
  const imageSrc = await productImage.getAttribute('src');
  
  return { locator: productImage, src: imageSrc };
}

//Comparar imagens entre visual_user e standard_user
async function compareProductImages(page, loginPage, productsPage, productName) {
  // Capturar imagem com visual_user
  const visualUserImage = await captureProductImage(
    productsPage, 
    productName, 
    'test-results/visual-bugs/backpack-image-visual-user.png'
  );
  
  // Fazer login com standard_user
  await page.goto('/');
  await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  await productsPage.page.waitForLoadState('networkidle');
  
  // Capturar imagem com standard_user
  const standardUserImage = await captureProductImage(
    productsPage, 
    productName, 
    'test-results/visual-bugs/backpack-image-standard-user.png'
  );
  
  return {
    visualUser: visualUserImage.src,
    standardUser: standardUserImage.src
  };
}

//Capturar e analisar badge do carrinho
async function captureCartBadge(page, productsPage, productName) {
  await productsPage.addProductToCartByName(productName);
  
  const cartBadge = await productsPage.getCartBadge();
  const cartLink = page.locator('.shopping_cart_link');
  
  await cartLink.screenshot({ 
    path: 'test-results/visual-bugs/cart-icon-visual-user.png' 
  });
  
  const badgeBox = await cartBadge.boundingBox();
  const badgeText = await cartBadge.textContent();
  
  return {
    locator: cartBadge,
    position: badgeBox,
    text: badgeText
  };
}

//Inspecionar todas as imagens dos produtos
async function inspectAllProductImages(page) {
  const productElements = await page.locator('.inventory_item').all();
  const products = [];
  
  for (let i = 0; i < productElements.length; i++) {
    const productElement = productElements[i];
    
    const productName = await productElement.locator('.inventory_item_name').textContent();
    const productImage = productElement.locator('.inventory_item_img img');
    const imageSrc = await productImage.getAttribute('src');
    
    await productElement.screenshot({ 
      path: `test-results/visual-bugs/product-${i + 1}-visual-user.png` 
    });
    
    products.push({
      name: productName,
      imageSrc,
      locator: productImage
    });
  }
  
  return products;
}

//Capturar screenshots full-page de ambos os usuários
async function captureFullPageComparison(page, loginPage, productsPage) {
  // Screenshot com visual_user
  await page.screenshot({ 
    path: 'test-results/visual-bugs/full-page-visual-user.png',
    fullPage: true
  });
  
  // Login com standard_user
  await page.goto('/');
  await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  await productsPage.page.waitForLoadState('networkidle');
  
  // Screenshot com standard_user
  await page.screenshot({ 
    path: 'test-results/visual-bugs/full-page-standard-user.png',
    fullPage: true
  });
}

//Coletar posições dos botões Add to Cart
async function collectButtonPositions(page) {
  const addButtons = await page.locator('[data-test^="add-to-cart"]').all();
  const positions = [];
  
  for (let i = 0; i < addButtons.length; i++) {
    const button = addButtons[i];
    const box = await button.boundingBox();
    const text = await button.textContent();
    
    positions.push({
      index: i + 1,
      text,
      position: box
    });
  }
  
  return positions;
}

//Comparar posições dos botões entre visual_user e standard_user
async function compareButtonPositions(page, loginPage, productsPage) {
  const visualUserPositions = await collectButtonPositions(page);
  
  // Login com standard_user
  await page.goto('/');
  await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  await productsPage.page.waitForLoadState('networkidle');
  
  const standardUserPositions = await collectButtonPositions(page);
  
  const differences = [];
  
  standardUserPositions.forEach((btn, i) => {
    if (visualUserPositions[i]) {
      const visualPos = visualUserPositions[i].position;
      const diff = {
        x: Math.abs(btn.position.x - visualPos.x),
        y: Math.abs(btn.position.y - visualPos.y)
      };
      
      if (diff.x > 5 || diff.y > 5) {
        differences.push({
          buttonIndex: i + 1,
          diff
        });
      }
    }
  });
  
  return {
    visualUser: visualUserPositions,
    standardUser: standardUserPositions,
    differences
  };
}

//Analisar alinhamento dos preços
async function analyzePriceAlignment(page) {
  const priceElements = await page.locator('.inventory_item_price').all();
  const prices = [];
  
  for (let i = 0; i < priceElements.length; i++) {
    const priceElement = priceElements[i];
    const price = await priceElement.textContent();
    const box = await priceElement.boundingBox();
    
    prices.push({ price, position: box });
  }
  
  // Calcular diferença máxima no alinhamento X
  const xPositions = prices.map(p => p.position.x);
  const maxDiff = Math.max(...xPositions) - Math.min(...xPositions);
  
  const isAligned = maxDiff <= 10;
  
  return {
    prices,
    maxDifference: maxDiff,
    isAligned
  };
}

module.exports = {
  compareProductImages,
  captureCartBadge,
  inspectAllProductImages,
  captureFullPageComparison,
  compareButtonPositions,
  analyzePriceAlignment
};
