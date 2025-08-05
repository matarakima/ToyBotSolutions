import { VALIDATION_RULES } from './constants';

export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push(VALIDATION_RULES.USERNAME.ERROR_MESSAGES.REQUIRED);
    return errors;
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    errors.push(VALIDATION_RULES.USERNAME.ERROR_MESSAGES.MIN_LENGTH);
  }
  
  if (trimmed.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    errors.push(VALIDATION_RULES.USERNAME.ERROR_MESSAGES.MAX_LENGTH);
  }
  
  if (!VALIDATION_RULES.USERNAME.PATTERN.test(trimmed)) {
    errors.push(VALIDATION_RULES.USERNAME.ERROR_MESSAGES.PATTERN);
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length === 0) {
    errors.push(VALIDATION_RULES.PASSWORD.ERROR_MESSAGES.REQUIRED);
    return errors;
  }
  
  // Removido el límite mínimo de caracteres
  
  return errors;
};

export const validateMessage = (message) => {
  const errors = [];
  
  if (!message || message.trim().length === 0) {
    errors.push(VALIDATION_RULES.MESSAGE.ERROR_MESSAGES.REQUIRED);
    return errors;
  }
  
  if (message.length > VALIDATION_RULES.MESSAGE.MAX_LENGTH) {
    errors.push(VALIDATION_RULES.MESSAGE.ERROR_MESSAGES.MAX_LENGTH);
  }
  
  return errors;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, ''); // Remover caracteres potencialmente peligrosos
};
