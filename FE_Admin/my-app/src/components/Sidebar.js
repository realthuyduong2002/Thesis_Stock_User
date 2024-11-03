import React from 'react';
import logo from '../assets/logo.png';
import callIcon from '../assets/call.png';
import avatar from '../assets/avatar.png';
import menuIcon from '../assets/menu.png';
import paperIcon from '../assets/paper.png';
import userIcon from '../assets/user.png';
import '../components/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" className="logo" />
      <img src={menuIcon} alt="Menu" />
      <img src={userIcon} alt="User" />
      <img src={callIcon} alt="Call" />
      <img src={paperIcon} alt="Paper" />
      <img src={avatar} alt="Avatar" className="avatar" />
    </div>
  );
};

export default Sidebar;