import React from 'react';
import logo from '../../assets/logo.png';
import usernameIcon from '../../assets/information.png';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
import repeatPasswordIcon from '../../assets/repeat-password.png';
import '../signup/SignupForm.css';

const SignupForm = () => {
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);

    return (
        <div className="signup-form">
            <img src={logo} alt="Stock Insight Logo" className="form-logo" />
            <h2>Create a new Stock Insight account</h2>
            <form>
                <div className="input-container">
                    <img src={usernameIcon} alt="Username Icon" className="input-icon" />
                    <input type="text" placeholder="Username" required />
                </div>
                <div className="input-container">
                    <img src={emailIcon} alt="Email Icon" className="input-icon" />
                    <input type="email" placeholder="Email" required />
                </div>
                <div className="input-container">
                    <img src={passwordIcon} alt="Password Icon" className="input-icon" />
                    <input type="password" placeholder="Password" required />
                </div>
                <div className="input-container">
                    <img src={repeatPasswordIcon} alt="Repeat Password Icon" className="input-icon" />
                    <input type="password" placeholder="Repeat your password" required />
                </div>
                <div className="dob-container">
                    <label>Date of birth</label>
                    <select name="month" required>
                        <option value="">Month</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                    <select name="day" required>
                        <option value="">Day</option>
                        {days.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <select name="year" required>
                        <option value="">Year</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <p className="terms">
                    By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
                </p>
                <button type="submit">Next</button>
            </form>
            <p className="login-link">Already have an account? <a href="/login">Log in</a></p>
        </div>
    );
};

export default SignupForm;