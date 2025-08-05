const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const { OpenAI } = require('openai');
require('dotenv').config();

// 🚀 Cache en memoria para embeddings - Mejora de rendimiento inmediata
const embeddingCache = new Map();
const CACHE_MAX_SIZE = 100; // Máximo 100 embeddings en cache
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos de vida útil

// Configuración del cliente de Azure OpenAI
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  }
});

// Función para generar embeddings usando Azure OpenAI con cache
async function generateEmbedding(query) {
  // Crear clave de cache normalizada
  const cacheKey = query.trim().toLowerCase();
  
  // Verificar cache primero
  if (embeddingCache.has(cacheKey)) {
    const cachedData = embeddingCache.get(cacheKey);
    
    // Verificar si el cache no ha expirado
    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log('✅ Embedding obtenido del cache');
      return cachedData.embedding;
    } else {
      // Cache expirado, eliminar entrada
      embeddingCache.delete(cacheKey);
    }
  }
  
  console.log('🔄 Generando nuevo embedding con Azure OpenAI');
  
  // Generar nuevo embedding
  const response = await openai.embeddings.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    input: query,
  });
  
  const embedding = response.data[0].embedding;
  
  // Guardar en cache
  embeddingCache.set(cacheKey, {
    embedding,
    timestamp: Date.now()
  });
  
  // Limpiar cache si es muy grande (FIFO)
  if (embeddingCache.size > CACHE_MAX_SIZE) {
    const firstKey = embeddingCache.keys().next().value;
    embeddingCache.delete(firstKey);
    console.log('🧹 Cache limpiado - entrada más antigua eliminada');
  }
  
  return embedding;
}

// 📊 Función para obtener estadísticas del cache (útil para debugging)
function getCacheStats() {
  const stats = {
    size: embeddingCache.size,
    maxSize: CACHE_MAX_SIZE,
    entries: Array.from(embeddingCache.keys()).map(key => ({
      query: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
      age: Math.round((Date.now() - embeddingCache.get(key).timestamp) / 1000) + 's'
    }))
  };
  
  console.log('📊 Cache Stats:', stats);
  return stats;
}

// RAG service: fetch context for chat
async function getRagContext(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('El parámetro query debe ser una cadena de texto válida.');
  }

  const searchClient = new SearchClient(
    process.env.AZURE_SEARCH_ENDPOINT, // URL del servicio de búsqueda desde variables de entorno
    process.env.AZURE_SEARCH_INDEX_NAME, // Nombre del índice desde variables de entorno
    new AzureKeyCredential(process.env.AZURE_SEARCH_KEY) // Clave API desde variables de entorno
  );

  try {
    const startTime = Date.now();
    const queryEmbedding = await generateEmbedding(query);
    const embeddingTime = Date.now() - startTime;
    
    console.log(`⚡ Embedding generado en ${embeddingTime}ms`);

    console.log('Embedding generado:', queryEmbedding); // Log del embedding

    // Primero intentemos una búsqueda de texto simple para diagnóstico
    const textResults = await searchClient.search(query);
    console.log('Búsqueda de texto simple:', textResults);
    
    // Convertir resultados de texto a array
    const textSearchResults = [];
    for await (const result of textResults.results) {
      textSearchResults.push(result);
    }
    console.log('Documentos de búsqueda de texto:', textSearchResults);

    // Si no hay resultados de texto, el índice puede estar vacío
    if (textSearchResults.length === 0) {
      console.log('Índice vacío, devolviendo contexto por defecto');
      return 'No hay documentos en el índice de búsqueda. Respondiendo sin contexto adicional.';
    }

    // Si hay un campo vectorial, usar el nombre correcto del campo
    const vectorQuery = {
      vector: queryEmbedding,
      kNearestNeighborsCount: 5,
      fields: ["content_vector"], // Cambié de "files" a "content_vector" que es más común
      kind: "vector",
      exhaustive: true
    };

    const results = await searchClient.search(query, { vectorQueries: [vectorQuery] }); 

    console.log('Resultados de Azure AI Search:', results); // Log de los resultados

    // Convertir el iterador de resultados en un array
    const searchResults = [];
    for await (const result of results.results) {
      searchResults.push(result);
    }

    console.log('Documentos encontrados:', searchResults); // Log de los documentos

    const context = searchResults.map((result) => result.document.content).join('\n');

    return context || 'No se encontró información relevante.';
  } catch (error) {
    console.error('Error al recuperar el contexto:', error);
    return `Error al recuperar información relevante: ${error.message}`;
  }
}

module.exports = { getRagContext, generateEmbedding, getCacheStats };
