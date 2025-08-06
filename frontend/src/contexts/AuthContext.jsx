import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiError } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const savedToken = localStorage.getItem('jwt');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('jwt', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  // 🆕 Función para manejar errores de autenticación automáticamente
  const handleAuthError = (error) => {
    if (error instanceof ApiError && error.requiresRelogin()) {
      logout();
      return true; // Indica que se hizo logout automático
    }
    return false; // No requiere logout
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    login,
    logout,
    handleAuthError, // 🆕 Nueva función
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
