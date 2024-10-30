import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';
import defaultAvatar from '../../assets/avatar.png';
import settingsIcon from '../../assets/settings.png';
import privacyIcon from '../../assets/privacy.png';
import helpIcon from '../../assets/help.png';
import addSwitchIcon from '../../assets/add-switch.png';
import '../common/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('User');
    const [userEmail, setUserEmail] = useState('user@example.com');
    const navigate = useNavigate();
    const [userAvatar, setUserAvatar] = useState(defaultAvatar);
    const [avatarTimestamp, setAvatarTimestamp] = useState(new Date().getTime());

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUserAvatar = localStorage.getItem('userAvatar');
        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
            if (storedUserAvatar) {
                setUserAvatar(storedUserAvatar);
            }

            axios.get(`http://localhost:4000/api/users/${storedUserId}`)
                .then(response => {
                    setUserName(response.data.username || 'User');
                    setUserEmail(response.data.email || 'user@example.com');
                    if (!storedUserAvatar) {
                        setUserAvatar(response.data.avatar || defaultAvatar);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Remove userId as well
        setIsLoggedIn(false);
        setIsDropdownOpen(false);
        navigate('/login'); // Redirect to login page after logout
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="header">
            <Link to="/">
                <img src={logo} alt="Stock Insight Logo" className="logo" />
            </Link>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for news, symbols or companies..."
                    className="search-bar"
                />
                <i className="fas fa-search search-icon"></i>
            </div>
            <div className="auth-links">
                {isLoggedIn ? (
                    <div className="user-menu">
                        <img
                            src={`${userAvatar}?timestamp=${avatarTimestamp}`}
                            alt="User Avatar"
                            className="user-avatar"
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <p>{userName}</p>
                                    <p>{userEmail}</p>
                                    <Link to={`/account/${userId}`}>Manage Your Account</Link>
                                </div>
                                <div className="dropdown-options">
                                    <Link to="/settings">
                                        <img
                                            src={settingsIcon}
                                            alt="Settings Icon"
                                            className="dropdown-icon"
                                        />
                                        Settings
                                    </Link>
                                    <Link to="/privacy">
                                        <img
                                            src={privacyIcon}
                                            alt="Privacy Icon"
                                            className="dropdown-icon"
                                        />
                                        Privacy
                                    </Link>
                                    <Link to="/help">
                                        <img
                                            src={helpIcon}
                                            alt="Help Icon"
                                            className="dropdown-icon"
                                        />
                                        Help
                                    </Link>
                                    <Link to="/switch-account">
                                        <img
                                            src={addSwitchIcon}
                                            alt="Add or Switch Accounts Icon"
                                            className="dropdown-icon"
                                        />
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