import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/login/LoginForm';
import './LoginPage.css';
import loginImage from '../assets/login.jpg';

const LoginPage = () => (
    <div className="login-page">
        <div className="form-section">
            <Link to="/" className="back-button">
                <i className="fas fa-arrow-left"></i>
            </Link>
            <LoginForm />
        </div>
        <div className="image-section">
            <img src={loginImage} alt="Stock Chart" />
        </div>
    </div>
);

export default LoginPage;