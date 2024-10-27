import React from 'react';
import logo from '../../assets/logo.png';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
import '../login/LoginForm.css';

const LoginForm = () => (
    <div className="login-form">
        <img src={logo} alt="Stock Insight Logo" className="form-logo" />
        <h2>Log in to Stock Insight</h2>
        <form>
            <div className="input-container">
                <img src={emailIcon} alt="Email Icon" className="input-icon" />
                <input type="email" placeholder="Your email" required />
            </div>
            <div className="input-container">
                <img src={passwordIcon} alt="Password Icon" className="input-icon" />
                <input type="password" placeholder="Password" required />
            </div>
            <button type="submit">Log in</button>
        </form>
        <p className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
        </p>
        <p className="register-link">
            Do not have an account? <a href="/register">Register now!</a>
        </p>
    </div>
);

export default LoginForm;