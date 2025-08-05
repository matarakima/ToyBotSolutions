// Constantes de la aplicación
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    ERROR_MESSAGES: {
      REQUIRED: 'El nombre de usuario es requerido',
      MIN_LENGTH: 'El nombre de usuario debe tener al menos 3 caracteres',
      MAX_LENGTH: 'El nombre de usuario no puede tener más de 20 caracteres',
      PATTERN: 'El nombre de usuario solo puede contener letras, números y guión bajo'
    }
  },
  PASSWORD: {
    ERROR_MESSAGES: {
      REQUIRED: 'La contraseña es requerida'
    }
  },
  MESSAGE: {
    MAX_LENGTH: 1000,
    ERROR_MESSAGES: {
      REQUIRED: 'El mensaje no puede estar vacío',
      MAX_LENGTH: 'El mensaje no puede tener más de 1000 caracteres'
    }
  }
};

export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
  TIMEOUT: 'La solicitud está tomando demasiado tiempo. Intenta nuevamente.',
  SERVER: 'Error del servidor. Intenta nuevamente en unos momentos.',
  UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  VALIDATION: 'Por favor verifica los datos ingresados.'
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};
