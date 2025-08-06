import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ChatPage from './pages/ChatPage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirigir la página principal al chat */}
          <Route path="/" element={<Navigate to="/chat" replace />} />
          
          {/* Página principal del chat con auth integrado */}
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Redirigir rutas antiguas al chat */}
          <Route path="/login" element={<Navigate to="/chat" replace />} />
          <Route path="/register" element={<Navigate to="/chat" replace />} />
          
          {/* 404 - redirigir al chat */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
