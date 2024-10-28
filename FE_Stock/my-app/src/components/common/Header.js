import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import avatar from '../../assets/avatar.png';
import settingsIcon from '../../assets/settings.png';
import privacyIcon from '../../assets/privacy.png';
import helpIcon from '../../assets/help.png';
import addSwitchIcon from '../../assets/add-switch.png';
import '../common/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="header">
            <img src={logo} alt="Stock Insight Logo" className="logo" />
            <div className="search-container">
                <input type="text" placeholder="Search for news, symbols or companies..." className="search-bar" />
                <i className="fas fa-search search-icon"></i>
            </div>
            <div className="auth-links">
                {isLoggedIn ? (
                    <div className="user-menu">
                        <img 
                            src={avatar} 
                            alt="User Avatar" 
                            className="user-avatar" 
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <p>User</p>
                                    <p>user@gmail.com</p>
                                    <button className="manage-account">Manage your account</button>
                                </div>
                                <div className="dropdown-options">
                                    <Link to="/settings">
                                        <img src={settingsIcon} alt="Settings Icon" className="dropdown-icon" />
                                        Settings
                                    </Link>
                                    <Link to="/privacy">
                                        <img src={privacyIcon} alt="Privacy Icon" className="dropdown-icon" />
                                        Privacy
                                    </Link>
                                    <Link to="/help">
                                        <img src={helpIcon} alt="Help Icon" className="dropdown-icon" />
                                        Help
                                    </Link>
                                    <Link to="/switch-account">
                                        <img src={addSwitchIcon} alt="Add or Switch Accounts Icon" className="dropdown-icon" />
                                        Add or switch accounts
                                    </Link>
                                </div>
                                <button onClick={handleLogout} className="sign-out">
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login">Log in</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;