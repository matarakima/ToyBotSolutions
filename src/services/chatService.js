// Chat service: RAG + GPT
const { getRagContext } = require('./ragService');
const { OpenAI } = require('openai');
const { getLocalLLMResponse } = require('./localLLMService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getChatResponse(message) {
  const context = await getRagContext(message);
  if (process.env.USE_LOCAL_LLM === 'true') {
    console.log('Usando modelo local LM Studio');
    return await getLocalLLMResponse(context, message, process.env.LOCAL_LLM_URL);
  } else {
    console.log('Usando modelo OpenAI');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Context: ${context}` },
        { role: 'user', content: message },
      ],
    });
    return completion.choices[0].message.content;
  }
}

module.exports = { getChatResponse };
