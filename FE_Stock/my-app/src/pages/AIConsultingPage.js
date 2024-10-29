import React, { useState } from 'react';
import styles from '../pages/AIConsultingPage.module.css';
import logo from '../assets/logo.png';
import menuIcon from '../assets/menu.png';
import upArrow from '../assets/up-arrow.png';

const AIConsultingPage = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSend = () => {
        if (inputValue.trim() !== '') {
            console.log("User Message:", inputValue);
            setInputValue('');
        }
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
                    <div className={styles.profileIcon} aria-label="User Profile">
                        <i className="fas fa-user-circle"></i>
                    </div>
                </header>
                <h1>
                    <span className={styles.hello}>Hello </span>
                    <span className={styles.user}>User</span>
                    <span className={styles.exclamation}>!</span>
                </h1>
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
