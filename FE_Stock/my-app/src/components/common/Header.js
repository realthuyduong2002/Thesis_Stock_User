import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.css';

const Header = () => (
    <header className="header">
        <img src={logo} alt="Stock Insight Logo" className="logo" />
        <div className="search-container">
            <input type="text" placeholder="Search for news, symbols or companies..." className="search-bar" />
            <i className="fas fa-search search-icon"></i>
        </div>
        <div className="auth-links">
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
        </div>
    </header>
);

export default Header;