// AIConsultingPage.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../pages/AIConsultingPage.module.css';
import logo from '../assets/logo.png';
import menuIcon from '../assets/menu.png';
import upArrow from '../assets/up-arrow.png';
import settingsIcon from '../assets/settings.png';
import privacyIcon from '../assets/privacy.png';
import helpIcon from '../assets/help.png';
import addSwitchIcon from '../assets/add-switch.png';
import { FaUserCircle } from 'react-icons/fa'; // Using react-icons for the user profile icon

const AIConsultingPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Indicates if the bot is typing
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null); // To store the interval ID

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() !== '') {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue('');
      setGreetingVisible(false);
      setIsTyping(true);

      // Add an empty bot message as a placeholder
      const botMessage = { text: '', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      try {
        // Send the user's message to the chatbot API
        const response = await axios.post('http://localhost:5000/chatbot', {
          query: inputValue,
        });

        // Get the chatbot's response from the API response
        const botResponse = response.data.response;

        // Start typing the bot's response
        typeMessage(botResponse);
      } catch (error) {
        console.error('Error communicating with the chatbot API:', error);
        // Handle error response by typing an error message
        typeMessage('Sorry, there was an error processing your request.');
      }
    }
  };

  const typeMessage = (fullText) => {
    let currentIndex = 0;
    const typingSpeed = 50; // milliseconds per character

    typingIntervalRef.current = setInterval(() => {
      currentIndex += 1;
      const currentText = fullText.substring(0, currentIndex);

      setMessages((prevMessages) => {
        // Update the last message (bot message) with the currentText
        const updatedMessages = [...prevMessages];
        if (updatedMessages.length === 0) return updatedMessages;
        const lastMessage = { ...updatedMessages[updatedMessages.length - 1] };
        lastMessage.text = currentText;
        updatedMessages[updatedMessages.length - 1] = lastMessage;
        return updatedMessages;
      });

      // Scroll to the latest message
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      if (currentIndex === fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
      }
    }, typingSpeed);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          <nav className={styles.navMenu}>
            <a href="/" className={styles.navLink}>
              Home
            </a>
            <a href="/news" className={styles.navLink}>
              News
            </a>
            <a href="/markets" className={styles.navLink}>
              Markets
            </a>
            <a href="/analysis" className={styles.navLink}>
              Analysis
            </a>
          </nav>
          <div
            className={styles.profileIcon}
            aria-label="User Profile"
            onClick={toggleProfileMenu}
          >
            <FaUserCircle size={32} color="#555" />
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
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.chatInputContainer}>
          <textarea
            placeholder="Ask AI Consulting..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={styles.chatInput}
            rows={1}
            disabled={isTyping} // Disable input while bot is typing
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isTyping} // Disable button while bot is typing
          >
            <img src={upArrow} alt="Send" className={styles.upArrowIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultingPage;
