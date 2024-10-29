import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import usernameIcon from '../../assets/information.png';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
import repeatPasswordIcon from '../../assets/repeat-password.png';
import '../signup/SignupForm.css';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        // Tạo dateOfBirth từ các trường ngày, tháng, năm
        const dateOfBirth = `${year}-${("0" + (months.indexOf(month) + 1)).slice(-2)}-${("0" + day).slice(-2)}`;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, dateOfBirth }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Account created successfully!");
                setError('');
            } else {
                setError(data.msg || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <div className="top-links">
                <a href="/help">Help</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
            </div>
            <div className="signup-form">
                <img src={logo} alt="Stock Insight Logo" className="form-logo" />
                <h2>Create a new Stock Insight account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <img src={usernameIcon} alt="Username Icon" className="input-icon" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <img src={emailIcon} alt="Email Icon" className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <img src={passwordIcon} alt="Password Icon" className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <img src={repeatPasswordIcon} alt="Repeat Password Icon" className="input-icon" />
                        <input
                            type="password"
                            placeholder="Repeat your password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="dob-container">
                        <label>Date of birth</label>
                        <select name="month" required onChange={(e) => setMonth(e.target.value)}>
                            <option value="">Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                        <select name="day" required onChange={(e) => setDay(e.target.value)}>
                            <option value="">Day</option>
                            {days.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <select name="year" required onChange={(e) => setYear(e.target.value)}>
                            <option value="">Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <p className="terms">
                        By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
                    </p>
                    <button type="submit">Next</button>
                </form>
                <p className="login-link">Already have an account? <a href="/login">Log in</a></p>
            </div>
        </div>
    );
};

export default SignupForm;
