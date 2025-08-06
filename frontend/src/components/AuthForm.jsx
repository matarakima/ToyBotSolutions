import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService, { ApiError } from '../services/apiService';
import { validateUsername, validatePassword, sanitizeInput } from '../utils/validation';
import '../styles/Auth.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
  const { login } = useAuth();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  }, [errors, submitError]);

  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    // Validación inmediata cuando el usuario sale del campo
    const newErrors = {};
    
    if (name === 'username') {
      const usernameErrors = validateUsername(value);
      if (usernameErrors.length > 0) {
        newErrors.username = usernameErrors[0];
      }
    } else if (name === 'password') {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    const usernameErrors = validateUsername(formData.username);
    if (usernameErrors.length > 0) {
      newErrors.username = usernameErrors[0];
    }
    
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError('');

    try {
      const { username, password } = formData;
      
      if (isLogin) {
        // Login directo
        const data = await apiService.login(username, password);
        if (data.success) {
          login({ username }, data.token);
        } else {
          setSubmitError(data.message || 'Error en el login');
        }
      } else {
        // Registro + login automático
        const registerData = await apiService.register(username, password);
        if (registerData.success) {
          // Auto-login después del registro
          const loginData = await apiService.login(username, password);
          if (loginData.success) {
            login({ username }, loginData.token);
          } else {
            setSubmitError('Usuario registrado, pero error en login automático. Intenta iniciar sesión manualmente.');
          }
        } else {
          setSubmitError(registerData.message || 'Error en el registro');
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.getDisplayMessage();
        const errorData = error.data;
        
        // Usar metadatos del backend si están disponibles
        if (errorData && errorData.errorType === 'validation' && errorData.field) {
          // Error de validación de campo específico → debajo del input
          if (errorData.field === 'password') {
            setErrors(prev => ({ ...prev, password: errorMessage }));
          } else if (errorData.field === 'username') {
            setErrors(prev => ({ ...prev, username: errorMessage }));
          } else {
            setSubmitError(errorMessage);
          }
        } else if (errorData && errorData.errorType === 'business') {
          // Error de negocio → arriba del formulario
          setSubmitError(errorMessage);
        } else {
          // Fallback: usar detección por contenido del mensaje
          if (isFieldValidationError(errorMessage)) {
            if (errorMessage.toLowerCase().includes('contraseña')) {
              setErrors(prev => ({ ...prev, password: errorMessage }));
            } else if (errorMessage.toLowerCase().includes('nombre de usuario') || errorMessage.toLowerCase().includes('usuario')) {
              setErrors(prev => ({ ...prev, username: errorMessage }));
            } else {
              setSubmitError(errorMessage);
            }
          } else {
            setSubmitError(errorMessage);
          }
        }
      } else {
        setSubmitError('Error inesperado. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para detectar errores de validación de campo
  const isFieldValidationError = (message) => {
    const fieldValidationKeywords = [
      'debe tener al menos',
      'no puede tener más de',
      'solo puede contener',
      'es obligatorio',
      'es requerido',
      'caracteres',
      'longitud',
      'formato'
    ];
    
    return fieldValidationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  };

  const resetForm = useCallback(() => {
    setFormData({ username: '', password: '' });
    setErrors({});
    setSubmitError('');
  }, []);

  const switchMode = useCallback(() => {
    setIsLogin(!isLogin);
    resetForm();
  }, [isLogin, resetForm]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🤖 ToyBot</h2>
          <p>Tu asistente inteligente para juguetes</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={switchMode}
            type="button"
            disabled={loading}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={switchMode}
            type="button"
            disabled={loading}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {submitError && <div className="auth-error">{submitError}</div>}
          
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              disabled={loading}
              className={errors.username ? 'error' : ''}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              autoComplete="username"
            />
            {errors.username && (
              <div id="username-error" className="field-error">
                {errors.username}
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
              disabled={loading}
              className={errors.password ? 'error' : ''}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {errors.password && (
              <div id="password-error" className="field-error">
                {errors.password}
              </div>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-text">
                {isLogin ? 'Iniciando sesión...' : 'Registrando...'}
              </span>
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Registrarse'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button" 
              className="auth-switch"
              onClick={switchMode}
              disabled={loading}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
