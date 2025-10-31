/**
 * BasePage - Classe base para todos os Page Objects
 * Contém métodos comuns e reutilizáveis
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navegar para uma URL
   * @param {string} url - URL para navegar
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Clicar em um elemento
   * @param {string} selector - Seletor do elemento
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Preencher um campo de texto
   * @param {string} selector - Seletor do campo
   * @param {string} text - Texto para preencher
   */
  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Obter texto de um elemento
   * @param {string} selector - Seletor do elemento
   * @returns {Promise<string>} Texto do elemento
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Verificar se elemento está visível
   * @param {string} selector - Seletor do elemento
   * @returns {Promise<boolean>}
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Aguardar elemento estar visível
   * @param {string} selector - Seletor do elemento
   * @param {number} timeout - Tempo máximo de espera
   */
  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Obter URL atual
   * @returns {string} URL atual
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Obter título da página
   * @returns {Promise<string>} Título da página
   */
  async getTitle() {
    return await this.page.title();
  }
}

module.exports = BasePage;
