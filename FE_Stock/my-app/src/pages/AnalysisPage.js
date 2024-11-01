// src/pages/AnalysisPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AnalysisPage.css';
import logo from '../assets/logo.png';
import defaultAvatar from '../assets/avatar.png';


const AnalysisPage = () => {
    return (
        <div className="analysis-page-container">
            <header className="header">
                <img src={logo} alt="Stock Insight Logo" className="logo" />
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/news" className="nav-link">News</Link>
                    <Link to="/markets" className="nav-link">Markets</Link>
                    <Link to="/analysis" className="nav-link">Analysis</Link>
                </nav>
                <div className="profile-icon">
                    <img src={defaultAvatar} alt="User Avatar" className="avatar" />
                </div>
            </header>
            
            <h1>Stock Analysis Dashboard</h1>
            <iframe
                src="https://thesis-dashboard.onrender.com/"
                title="Stock Price Predictions Dashboard"
                className="dashboard-iframe"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default AnalysisPage;
