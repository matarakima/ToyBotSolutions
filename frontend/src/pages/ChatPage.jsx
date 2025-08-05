import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chat from '../components/Chat';
import AuthForm from '../components/AuthForm';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <AuthForm />;
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-left">
          <h1>🤖 ToyBot</h1>
          <span className="chat-subtitle">Tu asistente inteligente</span>
        </div>
        <div className="chat-header-right">
          <span className="user-welcome">¡Hola, {user?.username}!</span>
          <button onClick={logout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      <main className="chat-main">
        <div className="chat-wrapper">
          <Chat />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
