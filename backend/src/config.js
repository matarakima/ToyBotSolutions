// Configuración para variables de entorno
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  openaiApiKey: process.env.OPENAI_API_KEY,
  USE_LOCAL_LLM: process.env.USE_LOCAL_LLM,
  LOCAL_LLM_URL: process.env.LOCAL_LLM_URL,
  LOCAL_LLM_MODEL: process.env.LOCAL_LLM_MODEL
};
