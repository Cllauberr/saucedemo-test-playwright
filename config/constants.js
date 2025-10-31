/**
 * Arquivo de constantes para credenciais e URLs
 */

module.exports = {
  // URL base da aplicação
  BASE_URL: 'https://www.saucedemo.com',
  
  // Credenciais de usuários disponíveis
  USERS: {
    STANDARD: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    LOCKED_OUT: {
      username: 'locked_out_user',
      password: 'secret_sauce'
    },
    PROBLEM: {
      username: 'problem_user',
      password: 'secret_sauce'
    },
    PERFORMANCE_GLITCH: {
      username: 'performance_glitch_user',
      password: 'secret_sauce'
    },
    VISUAL: {
      username: 'visual_user',
      password: 'secret_sauce'
    }
  },
  
  // Timeouts personalizados
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000
  }
};
