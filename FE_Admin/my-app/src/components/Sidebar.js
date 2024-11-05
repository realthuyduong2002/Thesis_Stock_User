// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaPhone, FaFileAlt, FaCog, FaUserCircle } from 'react-icons/fa';
import '../components/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <FaHome className="icon logo" size={30} onClick={() => navigate('/')} />
            <FaUser className="icon" size={24} onClick={() => navigate('/users')} />
            <FaPhone className="icon" size={24} onClick={() => navigate('/calls')} />
            <FaFileAlt className="icon" size={24} onClick={() => navigate('/papers')} />
            <FaCog className="icon" size={24} onClick={() => navigate('/settings')} />
            <FaUserCircle className="icon avatar" size={24} onClick={() => navigate('/login')} />
        </div>
    );
};

export default Sidebar;
