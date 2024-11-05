// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Login from './pages/Login';
import UserDetails from './pages/UserDetails';
import Header from './components/Header'; // Nếu Header là chung cho tất cả các trang
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:userId" element={<UserDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
