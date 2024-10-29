import React, { useState } from 'react';
import styles from '../pages/AIConsultingPage.module.css';
import logo from '../assets/logo.png';
import menuIcon from '../assets/menu.png';
import upArrow from '../assets/up-arrow.png';
import settingsIcon from '../assets/settings.png';
import privacyIcon from '../assets/privacy.png';
import helpIcon from '../assets/help.png';
import addSwitchIcon from '../assets/add-switch.png';

const AIConsultingPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [greetingVisible, setGreetingVisible] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSend = () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { text: inputValue, sender: 'user' }]);
            setInputValue('');
            setGreetingVisible(false);
        }
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    return (
        <div className={styles.aiConsultingPage}>
            <div className={styles.sidebar}>
                <button className={styles.menuButton} aria-label="Open Menu">
                    <img src={menuIcon} alt="Menu" className={styles.menuIcon} />
                </button>
            </div>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <img src={logo} alt="Stock Insight Logo" className={styles.logo} />
                    <nav className={styles.navMenu}>
                        <a href="/" className={styles.navLink}>Home</a>
                        <a href="/news" className={styles.navLink}>News</a>
                        <a href="/markets" className={styles.navLink}>Markets</a>
                        <a href="/analysis" className={styles.navLink}>Analysis</a>
                    </nav>
                    <div className={styles.profileIcon} aria-label="User Profile" onClick={toggleProfileMenu}>
                        <i className="fas fa-user-circle"></i>
                    </div>
                    {isProfileMenuOpen && (
                        <div className={styles.profileMenu}>
                            <p className={styles.profileName}>User</p>
                            <p className={styles.profileEmail}>user@gmail.com</p>
                            <button className={styles.manageAccount}>Manage your account</button>
                            <div className={styles.profileMenuOptions}>
                                <a href="/settings" className={styles.profileMenuItem}>
                                    <img src={settingsIcon} alt="Settings Icon" className={styles.menuIcon} /> Settings
                                </a>
                                <a href="/privacy" className={styles.profileMenuItem}>
                                    <img src={privacyIcon} alt="Privacy Icon" className={styles.menuIcon} /> Privacy
                                </a>
                                <a href="/help" className={styles.profileMenuItem}>
                                    <img src={helpIcon} alt="Help Icon" className={styles.menuIcon} /> Help
                                </a>
                                <a href="/switch-accounts" className={styles.profileMenuItem}>
                                    <img src={addSwitchIcon} alt="Add or Switch Accounts Icon" className={styles.menuIcon} /> Add or switch accounts
                                </a>
                            </div>
                            <button className={styles.logout}>Sign out</button>
                        </div>
                    )}
                </header>
                {greetingVisible && (
                    <h1>
                        <span className={styles.hello}>Hello </span>
                        <span className={styles.user}>User</span>
                        <span className={styles.exclamation}>!</span>
                    </h1>
                )}
                <div className={styles.messagesContainer}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : ''}`}
                        >
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className={styles.chatInputContainer}>
                    <textarea
                        placeholder="Ask AI Consulting..."
                        value={inputValue}
                        onChange={handleInputChange}
                        className={styles.chatInput}
                        rows={1}
                    />
                    <button className={styles.sendButton} onClick={handleSend}>
                        <img src={upArrow} alt="Send" className={styles.upArrowIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIConsultingPage;
