const BasePage = require('./BasePage');
const elements = require('../page-elements/LoginPageElements');

/**
 * LoginPage - Page Object para a página de login
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.elements = elements;
  }

  /**
   * Realizar login na aplicação
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   */
  async login(username, password) {
    await this.fill(this.elements.usernameInput, username);
    await this.fill(this.elements.passwordInput, password);
    await this.click(this.elements.loginButton);
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
   * Navegar para a página de login
   */
  async navigate() {
    await super.navigate('/');
  }

  /**
   * Verificar se está na página de login
   * @returns {Promise<boolean>}
   */
  async isOnLoginPage() {
    return await this.isVisible(this.elements.loginButton);
  }
}

module.exports = LoginPage;
