/**
 * CheckoutPageElements - Seletores das páginas de checkout
 */
module.exports = {
  // Checkout Step One (Informações)
  pageTitle: '.title',
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  postalCodeInput: '[data-test="postalCode"]',
  cancelButton: '[data-test="cancel"]',
  continueButton: '[data-test="continue"]',
  errorMessage: '[data-test="error"]',
  
  // Checkout Step Two (Overview)
  cartItem: '.cart_item',
  cartItemName: '.inventory_item_name',
  cartItemDesc: '.inventory_item_desc',
  cartItemPrice: '.inventory_item_price',
  summarySubtotal: '.summary_subtotal_label',
  summaryTax: '.summary_tax_label',
  summaryTotal: '.summary_total_label',
  finishButton: '[data-test="finish"]',
  
  // Checkout Complete
  completeHeader: '.complete-header',
  completeText: '.complete-text',
  backHomeButton: '[data-test="back-to-products"]'
};
