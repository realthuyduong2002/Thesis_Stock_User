import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import callIcon from '../assets/call.png';
import avatar from '../assets/avatar.png';
import menuIcon from '../assets/menu.png';
import paperIcon from '../assets/paper.png';
import userIcon from '../assets/user.png';
import '../components/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <img src={logo} alt="Logo" className="logo" />
            <img src={menuIcon} alt="Menu" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
            <img src={userIcon} alt="User" onClick={() => navigate('/users')} style={{ cursor: 'pointer' }} />
            <img src={callIcon} alt="Call" />
            <img src={paperIcon} alt="Paper" />
            <img src={avatar} alt="Avatar" className="avatar" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }} />
        </div>
    );
};

export default Sidebar;