// Servicio para conectar con LM Studio
const axios = require('axios');
const { createSystemMessage } = require('../utils/prompts');

async function getLocalLLMResponse(context, message, url) {
  const model = process.env.LOCAL_LLM_MODEL || 'google/gemma-3-12b';
  try {
    // Usar el prompt centralizado
    const systemMessage = createSystemMessage(context);

    console.log('Payload enviado a LM Studio:', {
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ]
    });
    
    const response = await axios.post(
      url || 'http://localhost:1234/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ]
      }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('Error LM Studio:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { getLocalLLMResponse };
