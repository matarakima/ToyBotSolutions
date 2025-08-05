import { VALIDATION_RULES } from './constants';

export const validateUsername = (username) => {
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push('El nombre de usuario es requerido');
    return errors;
  }
  
  const trimmed = username.trim();
  
  // Validación básica para UX inmediata - menos estricta que el backend
  if (trimmed.length < 2) {
    errors.push('El nombre de usuario es muy corto');
  }
  
  if (trimmed.length > 50) {
    errors.push('El nombre de usuario es muy largo');
  }
  
  // Validación básica de caracteres obviamente inválidos
  if (/[<>'"&]/.test(trimmed)) {
    errors.push('El nombre de usuario contiene caracteres no permitidos');
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length === 0) {
    errors.push('La contraseña es requerida');
    return errors;
  }
  
  // Validación básica para UX - menos estricta que el backend
  if (password.length < 2) {
    errors.push('La contraseña es muy corta');
  }
  
  if (password.length > 200) {
    errors.push('La contraseña es muy larga');
  }
  
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
