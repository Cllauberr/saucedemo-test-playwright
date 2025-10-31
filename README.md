# SauceDemo - Automação de Testes com Playwright

Projeto de automação de testes E2E para o site [SauceDemo](https://www.saucedemo.com) utilizando Playwright e Page Object Model (POM).

## Sobre o Projeto

Este projeto é uma POC (Proof of Concept) de automação de testes web que demonstra boas práticas de arquitetura e organização de testes automatizados, incluindo:

- **Page Object Model (POM)** com separação de elementos e ações
- **Data-Driven Testing** com fixtures JSON
- **Custom Fixtures** do Playwright para injeção de dependências
- **Testes de Regressão Visual** para detectar bugs visuais
- **Execução Multi-Browser** (Chromium, Firefox, WebKit)
- **Relatórios HTML** detalhados

## Estrutura do Projeto

```
saucedemo-test-playwright/
│
├── config/                  # Constantes e configurações
│   └── constants.js         # Credenciais e URLs
│
├── fixtures/                # Dados de teste em JSON
│   ├── checkout.json        # Dados de formulário de checkout
│   ├── messages.json        # Mensagens de validação
│   └── products.json        # Informações dos produtos
│
├── page-elements/           # Seletores CSS/XPath das páginas
│   ├── CartPageElements.js
│   ├── CheckoutPageElements.js
│   ├── LoginPageElements.js
│   ├── ProductDetailPageElements.js
│   └── ProductsPageElements.js
│
├── pages/                   # Page Objects
│   ├── BasePage.js          # Classe base com métodos comuns
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── LoginPage.js
│   ├── ProductDetailPage.js
│   └── ProductsPage.js
│
├── tests/e2e/               # Testes organizados por funcionalidade
│   ├── cart.spec.js         # 10 testes do carrinho
│   ├── checkout.spec.js     # 24 testes de checkout
│   ├── login.spec.js        # 14 testes de autenticação
│   ├── products.spec.js     # 18 testes de produtos
│   ├── purchase-flow.spec.js # 18 testes de fluxo E2E
│   └── visual-bugs.spec.js  # 6 testes de regressão visual
│
├── utils/                   # Utilitários e helpers
│   ├── fixtures.js          # Custom fixtures do Playwright
│   ├── helpers.js           # Funções auxiliares
│   └── visual-helpers.js    # Helpers para testes visuais
│
├── .gitignore
├── jsconfig.json            # Configuração do JavaScript
├── package.json
├── playwright.config.js     # Configuração do Playwright
└── README.md
```

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Cllauberr/saucedemo-test-playwright.git
cd saucedemo-test-playwright
```

2. Instale as dependências:
```bash
npm install
```

3. Instale os browsers do Playwright:
```bash
npx playwright install
```

## Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes de uma suite específica
```bash
npx playwright test login        # Testes de login
npx playwright test products     # Testes de produtos
npx playwright test cart         # Testes de carrinho
npx playwright test checkout     # Testes de checkout
npx playwright test purchase     # Testes de fluxo completo
npx playwright test visual       # Testes visuais
```

### Executar testes com interface visual
```bash
npm run test:ui
```

### Executar testes em modo debug
```bash
npm run test:debug
```

### Executar testes com browser visível
```bash
npm run test:headed
```

### Ver relatório HTML dos testes
```bash
npm run test:report
```

## Cobertura de Testes

O projeto possui **84 testes** distribuídos em:

| Suite | Testes | Descrição |
|-------|--------|-----------|
| **login.spec.js** | 14 | Autenticação com diferentes usuários e validações de erro |
| **products.spec.js** | 18 | Listagem, ordenação, detalhes e navegação de produtos |
| **cart.spec.js** | 10 | Adicionar, remover produtos e validações do carrinho |
| **checkout.spec.js** | 24 | Formulário de checkout e validações de campos |
| **purchase-flow.spec.js** | 18 | Fluxos E2E completos de compra |
| **visual-bugs.spec.js** | 6 | Detecção de bugs visuais (visual_user) |
| **Total** | **90** | Executados em 3 browsers (270 testes no total) |

### Testes de Regressão Visual

O projeto inclui 6 testes específicos para detectar problemas visuais conhecidos do `visual_user`:

1. **Imagens de produtos quebradas** - Detecta imagens com erro 404
2. **Posicionamento de botões** - Identifica botões fora de alinhamento
3. **Alinhamento de preços** - Verifica preços desalinhados
4. **Badge do carrinho** - Compara badge entre usuários
5. **Inspeção de todas as imagens** - Valida todas as imagens da página
6. **Comparação de layout** - Compara posicionamento de elementos

## Arquitetura

### Page Object Model (POM)

O projeto utiliza POM híbrido com separação clara de responsabilidades:

- **page-elements/**: Contém apenas seletores CSS/XPath
- **pages/**: Contém lógica de interação com as páginas
- **BasePage.js**: Classe base com métodos reutilizáveis

Exemplo:
```javascript
// page-elements/LoginPageElements.js
module.exports = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]'
};

// pages/LoginPage.js
class LoginPage extends BasePage {
  async login(username, password) {
    await this.fill(this.elements.usernameInput, username);
    await this.fill(this.elements.passwordInput, password);
    await this.click(this.elements.loginButton);
  }
}
```

### Data-Driven Testing

Todos os dados de teste são armazenados em fixtures JSON:

- **products.json**: Informações detalhadas dos produtos
- **checkout.json**: Dados válidos e inválidos para checkout
- **messages.json**: Mensagens de erro e sucesso

### Custom Fixtures

O projeto utiliza custom fixtures do Playwright para injeção automática de Page Objects:

```javascript
const { test } = require('../../utils/fixtures');

test('deve fazer login com sucesso', async ({ page, loginPage, productsPage }) => {
  // Page Objects são injetados automaticamente
  await page.goto('/');
  await loginPage.login('standard_user', 'secret_sauce');
  await productsPage.waitForPageLoad();
});
```

## Guia de Implementação

### 1. Configuração Inicial
- Instalar Node.js e dependências
- Configurar Playwright com browsers necessários
- Definir baseURL e timeouts no `playwright.config.js`

### 2. Estrutura do Projeto
- **config/** - Constantes e credenciais
- **fixtures/** - Dados de teste em JSON (produtos, checkout, mensagens)
- **page-elements/** - Seletores CSS/XPath das páginas
- **pages/** - Classes Page Object com ações das páginas
- **tests/e2e/** - Arquivos de testes organizados por funcionalidade
- **utils/** - Funções auxiliares e fixtures customizados

### 3. Page Objects
- `BasePage.js` contém métodos comuns (click, fill, navigate)
- Cada página tem arquivo de elementos separado
- Page Objects estendem BasePage e usam os elementos
- Métodos representam ações do usuário (login, addToCart, etc)

### 4. Fixtures e Dados de Teste
- Dados em JSON para evitar valores hardcoded
- Helpers carregam fixtures dinamicamente
- Fixtures do Playwright injetam Page Objects nos testes
- Fácil manutenção e reutilização de dados

### 5. Padrão de Testes
- Seguir AAA: Arrange (preparar), Act (agir), Assert (verificar)
- Usar Page Objects em vez de interagir diretamente com page
- Carregar dados via fixtures
- Testes independentes e isolados

### 6. Executar Testes
```bash
npm test                    # Todos os testes
npx playwright test login   # Suite específica
npm run test:report         # Ver relatório HTML
```

### Ordem de Implementação
1. Login → 2. Produtos → 3. Carrinho → 4. Checkout → 5. Fluxo E2E → 6. Testes visuais

### Manutenção
- **Atualizar seletor**: Apenas em `page-elements/`
- **Nova página**: Criar elementos + Page Object + adicionar fixture
- **Novo teste**: Usar Page Objects e fixtures existentes

## Boas Práticas Implementadas

- Separação de elementos e lógica
- Dados centralizados em fixtures
- Reutilização de código com BasePage
- Injeção de dependências com custom fixtures
- Testes independentes e isolados
- Nomenclatura clara e descritiva
- Comentários e documentação
- Tratamento de erros e timeouts
- Screenshots e vídeos em falhas
- Relatórios HTML detalhados

## Tecnologias Utilizadas

- [Playwright](https://playwright.dev/) v1.40.0 - Framework de automação
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- JavaScript (CommonJS) - Linguagem de programação

## Contribuindo

Sugestões e melhorias são bem-vindas. Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

MIT License

---

Projeto de automação de testes com Playwright e Page Object Model
