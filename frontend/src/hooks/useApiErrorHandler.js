import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../services/apiService';
import { useEffect } from 'react';

/**
 * Hook personalizado para interceptar errores de autenticación globalmente
 * Se puede usar en cualquier componente que haga peticiones a la API
 */
export const useApiErrorHandler = () => {
  const { handleAuthError } = useAuth();

  const handleError = (error) => {
    if (error instanceof ApiError) {
      const wasLoggedOut = handleAuthError(error);
      if (wasLoggedOut) {
        // Retorna true si se hizo logout automático
        return { 
          wasLoggedOut: true, 
          message: error.getDisplayMessage() 
        };
      }
    }
    
    return { 
      wasLoggedOut: false, 
      message: error instanceof ApiError ? error.getDisplayMessage() : error.message 
    };
  };

  return { handleError };
};

/**
 * Componente wrapper para interceptar errores de autenticación automáticamente
 * Envuelve a otros componentes y maneja logout automático
 */
export const ApiErrorBoundary = ({ children, onAuthError }) => {
  const { handleAuthError } = useAuth();

  useEffect(() => {
    // Interceptor global para fetch (opcional)
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok && response.status === 401) {
          const data = await response.clone().json();
          const error = new ApiError(response.status, data.message || 'Unauthorized', data);
          
          const wasLoggedOut = handleAuthError(error);
          if (wasLoggedOut && onAuthError) {
            onAuthError(error.getDisplayMessage());
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, [handleAuthError, onAuthError]);

  return children;
};
