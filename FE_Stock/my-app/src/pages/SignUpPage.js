import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/signup/SignupForm';
import '../pages/SignupPage.css';

const SignUpPage = () => (
    <div className="signup-page">
        <Link to="/" className="back-button">
            <i className="fas fa-arrow-left"></i>
        </Link>
        <SignupForm />
    </div>
);

export default SignUpPage;