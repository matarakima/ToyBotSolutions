const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const { OpenAI } = require('openai');
require('dotenv').config();

// 🚀 Cache en memoria para embeddings - Mejora de rendimiento inmediata
const embeddingCache = new Map();
const searchCache = new Map(); // 🔥 Cache Nivel 2: Resultados de búsqueda RAG
const responseCache = new Map(); // 🚀 Cache Nivel 3: Respuestas completas del LLM

const CACHE_MAX_SIZE = 100; // Máximo 100 entradas por cache
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos de vida útil
const SEARCH_CACHE_TTL = 15 * 60 * 1000; // 15 minutos para búsquedas (más corto)
const RESPONSE_CACHE_TTL = 60 * 60 * 1000; // 60 minutos para respuestas (más largo)

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
      return cachedData.embedding;
    } else {
      // Cache expirado, eliminar entrada
      embeddingCache.delete(cacheKey);
    }
  }
  
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
  }
  
  return embedding;
}

// 📊 Función para obtener estadísticas del cache (útil para debugging)
function getCacheStats() {
  const stats = {
    embeddings: {
      size: embeddingCache.size,
      maxSize: CACHE_MAX_SIZE,
      hitRate: '🔄 Se calcula en tiempo real',
      entries: Array.from(embeddingCache.keys()).map(key => ({
        query: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
        age: Math.round((Date.now() - embeddingCache.get(key).timestamp) / 1000) + 's'
      }))
    },
    searches: {
      size: searchCache.size,
      maxSize: CACHE_MAX_SIZE,
      entries: Array.from(searchCache.keys()).map(key => ({
        query: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
        age: Math.round((Date.now() - searchCache.get(key).timestamp) / 1000) + 's'
      }))
    },
    responses: {
      size: responseCache.size,
      maxSize: CACHE_MAX_SIZE,
      entries: Array.from(responseCache.keys()).map(key => ({
        query: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
        age: Math.round((Date.now() - responseCache.get(key).timestamp) / 1000) + 's'
      }))
    },
    totalMemoryUsage: `~${Math.round((embeddingCache.size + searchCache.size + responseCache.size) * 0.05)}MB estimado`
  };
  
  return stats;
}

// 🛠️ Funciones utilitarias para cache
function cleanExpiredCache(cache, ttl) {
  const now = Date.now();
  for (const [key, data] of cache.entries()) {
    if (now - data.timestamp > ttl) {
      cache.delete(key);
    }
  }
}

function limitCacheSize(cache, maxSize, cacheType) {
  while (cache.size > maxSize) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

function getCachedItem(cache, key, ttl) {
  if (cache.has(key)) {
    const cachedData = cache.get(key);
    if (Date.now() - cachedData.timestamp < ttl) {
      return cachedData;
    } else {
      cache.delete(key);
    }
  }
  return null;
}

function setCachedItem(cache, key, data, maxSize, cacheType) {
  cache.set(key, {
    ...data,
    timestamp: Date.now()
  });
  
  limitCacheSize(cache, maxSize, cacheType);
}

// 🚀 Cache Nivel 3: Funciones para respuestas completas del LLM
function getCachedResponse(query) {
  const cacheKey = query.trim().toLowerCase();
  const cached = getCachedItem(responseCache, cacheKey, RESPONSE_CACHE_TTL);
  
  if (cached) {
    return cached.response;
  }
  
  return null;
}

function setCachedResponse(query, response) {
  const cacheKey = query.trim().toLowerCase();
  setCachedItem(responseCache, cacheKey, { response }, CACHE_MAX_SIZE, 'Response');
}

// RAG service: fetch context for chat con Cache Nivel 2
async function getRagContext(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('El parámetro query debe ser una cadena de texto válida.');
  }

  // 🚀 Cache Nivel 2: Verificar si ya tenemos el contexto RAG cacheado
  const searchCacheKey = query.trim().toLowerCase();
  const cachedSearch = getCachedItem(searchCache, searchCacheKey, SEARCH_CACHE_TTL);
  
  if (cachedSearch) {
    return cachedSearch.context;
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

    // Primero intentemos una búsqueda de texto simple para diagnóstico
    const textResults = await searchClient.search(query);
    
    // Convertir resultados de texto a array
    const textSearchResults = [];
    for await (const result of textResults.results) {
      textSearchResults.push(result);
    }

    // Si no hay resultados de texto, el índice puede estar vacío
    if (textSearchResults.length === 0) {
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

    // Convertir el iterador de resultados en un array
    const searchResults = [];
    for await (const result of results.results) {
      searchResults.push(result);
    }

    const context = searchResults.map((result) => result.document.content).join('\n');
    const finalContext = context || 'No se encontró información relevante.';

    // 🚀 Cache Nivel 2: Guardar contexto RAG para futuras consultas
    setCachedItem(searchCache, searchCacheKey, { context: finalContext }, CACHE_MAX_SIZE, 'Search');

    return finalContext;
  } catch (error) {
    console.error('Error al recuperar el contexto:', error);
    return `Error al recuperar información relevante: ${error.message}`;
  }
}

module.exports = { 
  getRagContext, 
  generateEmbedding, 
  getCacheStats,
  getCachedResponse,
  setCachedResponse
};
