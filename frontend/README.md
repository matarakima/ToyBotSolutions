# ToyBotSolutions Frontend

Este proyecto es el frontend minimalista para ToyBotSolutions, desarrollado con React y Vite.

## Características
- Pantallas de login, registro y chat
- Consumo de endpoints del backend
- Autenticación JWT
- Interfaz moderna y minimalista

## Instalación

1. Instale las dependencias:
   ```bash
   npm install
   ```
2. Inicie la aplicación:
   ```bash
   npm run dev
   ```

## Configuración

Asegúrese de que el backend esté corriendo y accesible desde el frontend. Configure la URL del backend en los archivos de servicios según corresponda.

## Estructura sugerida
- `/src/pages/Login.jsx`
- `/src/pages/Register.jsx`
- `/src/pages/Chat.jsx`
- `/src/services/api.js` (servicios para consumir el backend)

## Personalización
Adapte los estilos y componentes según las necesidades del proyecto.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
