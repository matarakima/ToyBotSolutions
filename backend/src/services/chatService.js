// Chat service: RAG + GPT con Cache Multinivel
const { getRagContext, getCachedResponse, setCachedResponse } = require('./ragService');
const { OpenAI } = require('openai');
const { getLocalLLMResponse } = require('./localLLMService');
const { createSystemMessage } = require('../utils/prompts');

// Configurar cliente para Azure OpenAI
const azureOpenAI = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_CHAT_DEPLOYMENT}`,
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  }
}); 

async function getChatResponse(message) {
  try {
    // 🚀 Cache Nivel 3: Verificar si ya tenemos una respuesta completa cacheada
    const cachedResponse = getCachedResponse(message);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Si no hay cache, proceder con el flujo normal
    const context = await getRagContext(message);
    
    let response;
    
    if (process.env.USE_LOCAL_LLM === 'true') {
      response = await getLocalLLMResponse(context, message, process.env.LOCAL_LLM_URL);
    } else {
      // Usar el prompt centralizado
      const systemMessage = createSystemMessage(context);
      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ];
      
      const completion = await azureOpenAI.chat.completions.create({
        model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT,
        messages: messages,
      });
      response = completion.choices[0].message.content;
    }

    // 🚀 Cache Nivel 3: Guardar la respuesta completa para futuras consultas
    setCachedResponse(message, response);
    
    return response;
  } catch (error) {
    console.error('Error en getChatResponse:', error);
    throw error;
  }
}

module.exports = { getChatResponse };
