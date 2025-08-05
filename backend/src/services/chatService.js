// Chat service: RAG + GPT
const { getRagContext } = require('./ragService');
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
    const context = await getRagContext(message);
    console.log('Contexto RAG obtenido:', context);
    
    if (process.env.USE_LOCAL_LLM === 'true') {
      console.log('Usando modelo local LM Studio');
      return await getLocalLLMResponse(context, message, process.env.LOCAL_LLM_URL);
    } else {
      console.log('Usando modelo Azure OpenAI');
      
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
      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error('Error en getChatResponse:', error);
    throw error;
  }
}

module.exports = { getChatResponse };
