# Estructura de Pruebas Automatizadas - ToyBotSolutions

## 📋 Descripción

Esta estructura de pruebas automatizadas está diseñada para ser **completamente independiente** del código fuente del proyecto. No modifica, sobrescribe ni elimina ningún archivo existente creado por el equipo de desarrollo.

## 🏗️ Estructura del Proyecto

```
testing/
├── README.md                    # Este archivo
├── package.json                 # Dependencias de testing
├── jest.config.js              # Configuración de Jest
├── setup/
│   ├── global-setup.js         # Configuración global de pruebas
│   └── test-database.js        # Configuración de base de datos de pruebas
├── unit/
│   ├── utils/
│   │   └── hash.test.js        # Pruebas unitarias de utilidades
│   └── services/
│       └── chatService.test.js # Pruebas unitarias de servicios
├── integration/
│   └── routes/
│       ├── auth.integration.test.js  # Pruebas de integración de autenticación
│       └── chat.integration.test.js  # Pruebas de integración de chat
├── e2e/
│   └── auth-flow.test.js       # Pruebas end-to-end de flujo de autenticación
├── scripts/
│   └── run-tests.sh            # Script para ejecutar todas las pruebas
├── mocks/
│   ├── openai.mock.js          # Mock de OpenAI API
│   └── database.mock.js        # Mock de base de datos
└── reports/                    # Reportes de cobertura (generados automáticamente)
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 20+ 
- npm o yarn
- Acceso al código fuente del proyecto

### Pasos de Instalación

1. **Navegar a la carpeta de testing:**
   ```bash
   cd testing
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con las configuraciones necesarias
   ```

## 🧪 Ejecución de Pruebas

### Ejecutar Todas las Pruebas
```bash
npm test
```

### Ejecutar Pruebas por Tipo
```bash
# Solo pruebas unitarias
npm run test:unit

# Solo pruebas de integración
npm run test:integration

# Solo pruebas E2E
npm run test:e2e

# Con cobertura
npm run test:coverage
```

### Ejecutar Pruebas Específicas
```bash
# Ejecutar un archivo específico
npm test -- auth.test.js

# Ejecutar con watch mode
npm run test:watch
```

## 📊 Reportes de Cobertura

Los reportes de cobertura se generan automáticamente en la carpeta `reports/`:

- **HTML**: `reports/coverage/index.html` - Reporte visual detallado
- **JSON**: `reports/coverage/coverage.json` - Datos estructurados
- **LCOV**: `reports/coverage/lcov.info` - Formato para CI/CD

### Ver Reporte HTML
```bash
# En Windows
start reports/coverage/index.html

# En macOS
open reports/coverage/index.html

# En Linux
xdg-open reports/coverage/index.html
```

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en la carpeta `testing/`:

```env
# Configuración del servidor
TEST_SERVER_PORT=3001
TEST_SERVER_HOST=localhost

# Configuración de base de datos
TEST_DB_PATH=./test-database.sqlite

# Configuración de JWT
TEST_JWT_SECRET=test-secret-key

# Configuración de OpenAI (para mocks)
OPENAI_API_KEY=test-key
```

### Configuración de Jest
El archivo `jest.config.js` está configurado para:
- Ejecutar pruebas en paralelo
- Generar reportes de cobertura
- Usar mocks automáticamente
- Configurar timeouts apropiados

## 📝 Agregar Nuevas Pruebas

### 1. Pruebas Unitarias
Crear archivo en `unit/[categoria]/[nombre].test.js`:

```javascript
const { functionToTest } = require('../../../backend/src/path/to/module');

describe('Nombre del Módulo', () => {
  test('debería hacer algo específico', () => {
    const result = functionToTest(input);
    expect(result).toBe(expectedOutput);
  });
});
```

### 2. Pruebas de Integración
Crear archivo en `integration/[categoria]/[nombre].integration.test.js`:

```javascript
const request = require('supertest');
const { createTestServer } = require('../../setup/test-server');

describe('API Endpoint', () => {
  let server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(async () => {
    await server.close();
  });

  test('debería responder correctamente', async () => {
    const response = await request(server)
      .post('/api/endpoint')
      .send({ data: 'test' });
    
    expect(response.status).toBe(200);
  });
});
```

### 3. Pruebas E2E
Crear archivo en `e2e/[nombre].test.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('flujo completo de usuario', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // ... pasos del flujo
  await expect(page.locator('.success')).toBeVisible();
});
```

## 🔄 CI/CD Integration

### GitHub Actions
El archivo `.github/workflows/test.yml` está configurado para:

1. **Instalar dependencias** del proyecto y testing
2. **Ejecutar pruebas** en paralelo
3. **Generar reportes** de cobertura
4. **Subir reportes** como artifacts
5. **Notificar** resultados

### Configuración Local para CI/CD
```bash
# Ejecutar como en CI/CD
npm run test:ci
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de puerto ocupado:**
   ```bash
   # Cambiar puerto en .env
   TEST_SERVER_PORT=3002
   ```

2. **Error de base de datos:**
   ```bash
   # Limpiar base de datos de pruebas
   npm run test:clean-db
   ```

3. **Error de dependencias:**
   ```bash
   # Reinstalar dependencias
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs Detallados
```bash
# Ejecutar con logs verbosos
npm test -- --verbose
```

## 📚 Buenas Prácticas

### Nomenclatura
- **Archivos de prueba**: `[nombre].test.js` o `[nombre].spec.js`
- **Describe blocks**: Usar nombres descriptivos en español
- **Test cases**: Usar formato "debería [acción] cuando [condición]"

### Estructura de Pruebas
```javascript
describe('Nombre del Módulo', () => {
  // Setup
  beforeEach(() => {
    // Preparación antes de cada prueba
  });

  // Teardown
  afterEach(() => {
    // Limpieza después de cada prueba
  });

  // Casos de prueba
  describe('cuando [condición]', () => {
    test('debería [resultado esperado]', () => {
      // Implementación
    });
  });
});
```

### Mocks y Stubs
- Usar mocks para dependencias externas
- Crear stubs para funciones complejas
- Mantener mocks en la carpeta `mocks/`

## 🤝 Contribución

Para agregar nuevas funcionalidades de testing:

1. Crear rama desde `main`
2. Implementar cambios en carpeta `testing/`
3. Agregar pruebas para nuevas funcionalidades
4. Verificar que todas las pruebas pasen
5. Crear Pull Request

## 📞 Soporte

Para problemas o preguntas sobre la estructura de pruebas:

1. Revisar este README
2. Verificar logs de errores
3. Consultar documentación de Jest y Supertest
4. Crear issue en el repositorio

---

**Nota**: Esta estructura está diseñada para ser portable y puede ser copiada a cualquier release del proyecto sin modificar el código fuente. 