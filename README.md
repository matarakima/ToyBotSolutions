# ToyBotSolutions

ToyBotSolutions es una aplicación backend desarrollada en Node.js y Fastify que expone endpoints para registro, autenticación y chat inteligente. El sistema soporta integración con modelos OpenAI y LM Studio, y está preparado para funcionar tanto en entornos locales como en Azure SQL.

## Instalación y configuración

Siga estos pasos para instalar y ejecutar el proyecto desde cero:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/<usuario>/<repositorio>.git
   cd ToyBotSolutions
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copie el archivo `.env.example` a `.env` y complete los valores necesarios:
     ```bash
     cp .env.example .env
     ```
   - Edite `.env` para definir claves, puertos y credenciales según su entorno.

4. **Ejecutar migraciones de base de datos**
   ```bash
   npx knex migrate:latest
   ```

5. **Iniciar la aplicación**
   ```bash
   npm start
   ```

6. **Ejecutar pruebas**
   ```bash
   npm test
   ```

## Endpoints principales

- `/register` — Registro de usuario
- `/login` — Autenticación y obtención de token JWT
- `/chat` — Chat protegido con autenticación JWT

## Requisitos

- Node.js 20+
- SQLite (local) o Azure SQL (producción)

Para más información sobre configuración avanzada, revise los archivos de ejemplo y la documentación interna del proyecto.

## Ejemplos de uso con curl

A continuación se presentan ejemplos para probar los endpoints principales utilizando la herramienta `curl`:

### Registro de usuario

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### Login de usuario (obtención de token JWT)

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

El resultado incluirá un campo `token` que debe utilizarse en el siguiente endpoint.

### Chat protegido (requiere token JWT)

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"message":"Hola"}'
```

Reemplace `<TOKEN>` por el valor obtenido en el login.