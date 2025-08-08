module.exports = {
  // Configuración del entorno de pruebas
  testEnvironment: 'node',
  
  // Archivos de configuración global
  setupFilesAfterEnv: ['<rootDir>/setup/global-setup.js'],
  
  // Patrones de archivos a incluir en las pruebas
  testMatch: [
    '<rootDir>/**/*.test.js',
    '<rootDir>/**/*.spec.js'
  ],
  
  // Patrones de archivos a excluir
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/reports/',
    '<rootDir>/scripts/',
    '<rootDir>/e2e/'  // Excluir testes E2E do Playwright
  ],
  
  // Configuración de cobertura
  collectCoverageFrom: [
    '../backend/src/**/*.js',
    '!../backend/src/app.js',
    '!../backend/src/config.js',
    '!../backend/src/migrations/**',
    '!../backend/src/knexfile.js'
  ],
  
  // Directorio de reportes de cobertura
  coverageDirectory: 'reports/coverage',
  
  // Tipos de reportes de cobertura
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  
  // Umbrales de cobertura (opcional)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Configuración de mocks automáticos
  automock: false,
  
  // Configuración de módulos mock
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../backend/src/$1'
  },
  
  // Configuración de transformaciones
  transform: {},
  
  // Configuración de timeouts
  testTimeout: 10000,
  
  // Configuración de workers
  maxWorkers: '50%',
  
  // Configuración de verbosidad
  verbose: true,
  
  // Configuración de CI/CD
  ci: process.env.CI === 'true',
  
  // Configuración de watch mode
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/reports/',
    '<rootDir>/e2e/'
  ],
  
  // Configuración de notificaciones
  notify: false,
  
  // Configuración de errores
  errorOnDeprecated: true,
  
  // Configuración de globals
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
}; 