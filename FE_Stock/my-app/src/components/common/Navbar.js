// Navbar.jsx

import React from 'react';
import '../common/Navbar.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Stock Insight</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link 
                        to="/" 
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        News
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/markets" 
                        className={location.pathname === '/markets' ? 'active' : ''}
                    >
                        Markets
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/ai-consulting" 
                        className={location.pathname === '/ai-consulting' ? 'active' : ''}
                    >
                        AI Consulting
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/analysis" 
                        className={location.pathname === '/analysis' ? 'active' : ''}
                    >
                        Analysis
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
