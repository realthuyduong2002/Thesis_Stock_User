import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Login from './pages/Login';
import UserDetails from './pages/UserDetails';
import Header from './components/Header';
import './App.css';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar />}
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/users"
              element={isAuthenticated ? <UserList /> : <Navigate to="/login" />}
            />
            <Route
              path="/users/:userId"
              element={isAuthenticated ? <UserDetails /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;