const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Diretório onde os testes estão localizados
  testDir: './tests',
  
  // Timeout máximo para cada teste (30 segundos)
  timeout: 30000,
  
  // Configurações de expect
  expect: {
    // Timeout para asserções (5 segundos)
    timeout: 5000
  },
  
  // Executar testes em paralelo
  fullyParallel: true,
  
  // Falhar o build no CI se você acidentalmente deixou test.only
  forbidOnly: !!process.env.CI,
  
  // Número de retentativas em caso de falha no CI
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers para execução paralela
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter para exibir resultados dos testes
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  // Configurações compartilhadas para todos os projetos
  use: {
    // URL base para usar em actions como `await page.goto('/')`
    baseURL: 'https://www.saucedemo.com',
    
    // Capturar screenshot apenas em falhas
    screenshot: 'only-on-failure',
    
    // Capturar vídeo apenas em falhas
    video: 'retain-on-failure',
    
    // Capturar trace apenas em falhas
    trace: 'on-first-retry',
    
    // Timeout para navegação
    navigationTimeout: 10000,
    
    // Timeout para ações
    actionTimeout: 10000,
  },

  // Configurar projetos para diferentes browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
