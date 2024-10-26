import React from 'react';
import '../common/Navbar.css';

const Navbar = () => (
    <nav className="navbar">
        <a href="/news">News</a>
        <a href="/markets">Markets</a>
        <a href="/ai-consulting">AI Consulting</a>
        <a href="/analysis">Analysis</a>
    </nav>
);

export default Navbar;