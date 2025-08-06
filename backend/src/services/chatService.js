// Chat service: RAG + GPT con Cache Multinivel + Historial de Conversación
const { getRagContext, getCachedResponse, setCachedResponse } = require('./ragService');
const { conversationHistory } = require('./conversationHistoryService');
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

async function getChatResponse(message, username) {
  try {
    // 🚀 Cache Nivel 3: Verificar si ya tenemos una respuesta completa cacheada
    // NOTA: Con historial, el cache es menos efectivo, pero mantenemos para mensajes únicos
    const cachedResponse = getCachedResponse(message);
    if (cachedResponse) {
      // Agregar al historial aunque sea cacheado
      conversationHistory.addMessage(username, 'user', message);
      conversationHistory.addMessage(username, 'assistant', cachedResponse);
      return cachedResponse;
    }

    // Agregar mensaje del usuario al historial
    conversationHistory.addMessage(username, 'user', message);

    // Obtener historial de conversación
    const conversationMessages = conversationHistory.getFormattedHistory(username);

    // Si no hay cache, proceder con el flujo normal
    const context = await getRagContext(message);
    
    let response;
    
    if (process.env.USE_LOCAL_LLM === 'true') {
      response = await getLocalLLMResponse(context, message, process.env.LOCAL_LLM_URL);
    } else {
      // Usar el prompt centralizado
      const systemMessage = createSystemMessage(context);
      
      // Construir mensajes incluyendo el historial
      const messages = [
        { role: 'system', content: systemMessage },
        ...conversationMessages // Incluir historial completo
      ];
      
      // Si el último mensaje no es el actual, agregarlo
      if (conversationMessages.length === 0 || 
          conversationMessages[conversationMessages.length - 1].content !== message) {
        messages.push({ role: 'user', content: message });
      }
      
      const completion = await azureOpenAI.chat.completions.create({
        model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT,
        messages: messages,
        temperature: 0.7, // Aumentar creatividad para conversaciones
        max_tokens: 1000
      });
      response = completion.choices[0].message.content;
    }

    // Agregar respuesta del asistente al historial
    conversationHistory.addMessage(username, 'assistant', response);

    // 🚀 Cache Nivel 3: Guardar la respuesta completa para futuras consultas
    setCachedResponse(message, response);
    
    return response;
  } catch (error) {
    console.error('Error en getChatResponse:', error);
    throw error;
  }
}

module.exports = { 
  getChatResponse,
  // Exportar funciones del historial para uso en endpoints
  clearConversation: (username) => conversationHistory.clearConversation(username),
  getConversationHistory: (username) => conversationHistory.getHistory(username),
  getConversationStats: () => conversationHistory.getStats()
};
