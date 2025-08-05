import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Chat from '../components/Chat';
import AuthForm from '../components/AuthForm';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const { isAuthenticated, loading } = useAuth();

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
      <main className="chat-main">
        <Chat />
      </main>
    </div>
  );
};

export default ChatPage;
