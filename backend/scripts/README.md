# Scripts de Azure AI Search - ToyBot

Scripts para gestionar la integración con Azure AI Search del chatbot ToyBot.

## 📁 Scripts Disponibles

### 🔧 `check-config.js`
**Uso:** `npm run check-config`
- Verificar variables de Azure Search
- Verificar archivos de configuración  
- Verificar carpeta rag-data

### 🏗️ `create-optimized-index.js`
**Uso:** `npm run create-index`
- Crear índice optimizado (8 campos)
- Configurar analyzers en español
- Establecer filtros y facets

### 📤 `upload-rag-optimized.js`
**Uso:** `npm run upload-rag`
- Subir archivos RAG con metadatos automáticos
- Categorización automática por contenido
- Extracción de keywords

### 🧪 `test-azure-search.js`
**Uso:** `npm run test-search`
- Probar búsquedas y validar funcionamiento
- Estadísticas del índice
- Modo interactivo disponible

## 🚀 Flujo de Trabajo

1. `npm run check-config` - Verificar configuración
2. `npm run create-index` - Crear índice (solo una vez)
3. `npm run upload-rag` - Subir datos RAG
4. `npm run test-search` - Probar búsquedas

## 🎯 Estado Actual

✅ Índice optimizado: `toybot-knowledge-base`
✅ 9 documentos indexados
✅ 7 categorías diferentes
✅ Búsquedas funcionando correctamente
✅ Listo para integración con chatbot
