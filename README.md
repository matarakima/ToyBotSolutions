# ToyBotSolutions 🤖

ToyBotSolutions es una aplicación full-stack moderna que combina un potente backend en Node.js/Fastify con un elegante frontend en React. El sistema ofrece autenticación segura, chat inteligente con IA, y un sistema RAG (Retrieval-Augmented Generation) con caché multinivel para respuestas optimizadas.

## 🌟 Características principales

- **🔐 Autenticación JWT**: Sistema seguro de registro y login
- **🤖 Chat inteligente**: Integración con OpenAI GPT y LM Studio
- **🚀 Sistema RAG**: Búsqueda semántica con Azure Cognitive Search
- **⚡ Caché multinivel**: 3 niveles de caché para máximo rendimiento
- **🎨 UI moderna**: Interfaz React con diseño glassmorphism
- **📱 Responsive**: Adaptado para desktop y móvil
- **🔒 Seguro**: Validación robusta y sanitización de datos

## 🏗️ Arquitectura

```
ToyBotSolutions/
├── backend/                    # API REST con Fastify v5
│   ├── src/
│   │   ├── routes/            # Rutas de autenticación y chat
│   │   ├── services/          # Lógica de negocio y RAG
│   │   ├── models/            # Modelos de datos
│   │   └── utils/             # Utilidades y helpers
│   └── package.json
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Cliente API
│   │   ├── contexts/          # Contextos React
│   │   └── styles/            # CSS moderno
│   └── package.json
└── testing/                    # Suite de pruebas E2E y unitarias
```

## 🚀 Instalación y configuración

### Prerrequisitos
- Node.js 20+
- npm o yarn
- SQLite (local) o Azure SQL (producción)

### 1. Clonar el repositorio
```bash
git clone https://github.com/matarakima/ToyBotSolutions.git
cd ToyBotSolutions
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones
npx knex migrate:latest

# Iniciar servidor
npm start
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install

# Iniciar aplicación React
npm run dev
```

## 🔧 Variables de entorno

### Backend (.env)
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DATABASE_URL=./database.sqlite

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_EXPIRES_IN=24h

# OpenAI
OPENAI_API_KEY=tu_openai_api_key

# Azure (opcional)
AZURE_OPENAI_ENDPOINT=tu_endpoint
AZURE_OPENAI_API_KEY=tu_api_key
AZURE_SEARCH_ENDPOINT=tu_search_endpoint
AZURE_SEARCH_API_KEY=tu_search_key
AZURE_SEARCH_INDEX=tu_index
```

## 📡 API Endpoints

### Autenticación
- `POST /register` — Registro de usuario
- `POST /login` — Autenticación y obtención de token JWT

### Chat
- `POST /chat` — Chat protegido con autenticación JWT

### Estadísticas
- `GET /cache/stats` — Estadísticas del sistema de caché

## 🎨 Características del Frontend

### 🎭 Diseño moderno
- **Glassmorphism**: Efectos de cristal y blur
- **Gradientes**: Paleta de colores moderna
- **Animaciones**: Transiciones suaves
- **Responsive**: Adaptado a todos los dispositivos

### 💬 Chat inteligente
- **Burbujas de chat**: Estilo WhatsApp/Telegram
- **Timestamps**: Hora en cada mensaje
- **Indicador de escritura**: Animación elegante
- **Auto-scroll**: Navegación automática
- **Markdown**: Soporte completo para formato de texto

### 🔐 Autenticación integrada
- **Formularios elegantes**: Login y registro unificados
- **Validación en tiempo real**: Feedback inmediato
- **Gestión de sesiones**: Persistencia automática
- **Auto-logout**: Cierre automático en errores de auth

## 🧪 Pruebas

### Ejecutar todas las pruebas
```bash
cd testing
npm test
```

### Pruebas específicas
```bash
# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration

# Pruebas E2E
npm run test:e2e
```

## 📖 Ejemplos de uso

### 🔐 Registro de usuario
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario123","password":"password123"}'
```

### 🔑 Login de usuario
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario123","password":"password123"}'
```

### 💬 Chat con IA
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"message":"¿Qué puedes hacer?"}'
```

## 🚀 Despliegue

### Desarrollo
```bash
# Backend
cd backend && npm start

# Frontend (nueva terminal)
cd frontend && npm run dev
```

### Producción
```bash
# Construir frontend
cd frontend && npm run build

# Iniciar backend en modo producción
cd backend && NODE_ENV=production npm start
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Fastify** - Framework web rápido y eficiente
- **React** - Biblioteca para interfaces de usuario
- **OpenAI** - Modelos de IA avanzados
- **Azure** - Servicios de búsqueda y IA en la nube

---

**Hecho con ❤️ por el equipo de ToyBotSolutions**