import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import './App.css';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AIConsultingPage from './pages/AIConsultingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/ai-consulting" element={<AIConsultingPage />} />
          </Routes>
      </Router>
  );
}

export default App;