// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            {/* Thêm các route khác ở đây nếu cần */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
