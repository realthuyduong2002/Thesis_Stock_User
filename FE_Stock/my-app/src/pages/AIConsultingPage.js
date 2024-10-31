import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import styles from '../pages/AIConsultingPage.module.css';
import logo from '../assets/logo.png';
import menuIcon from '../assets/menu.png';
import upArrow from '../assets/up-arrow.png';
import settingsIcon from '../assets/settings.png';
import privacyIcon from '../assets/privacy.png';
import helpIcon from '../assets/help.png';
import addSwitchIcon from '../assets/add-switch.png';
import defaultAvatar from '../assets/avatar.png';
import { FaUserCircle } from 'react-icons/fa';

const AIConsultingPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState({
    username: 'User',
    email: 'user@example.com',
    avatar: defaultAvatar,
  });
  const [avatarTimestamp, setAvatarTimestamp] = useState(new Date().getTime());
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      if (token && storedUserId) {
        try {
          const response = await axios.get(`http://localhost:4000/api/users/${storedUserId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { username, email, avatar } = response.data;
          setUserData({
            username: username || 'User',
            email: email || 'user@example.com',
            avatar: avatar || defaultAvatar,
          });
          if (avatar) {
            setAvatarTimestamp(new Date().getTime());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData({
            ...userData,
            avatar: defaultAvatar,
          });
        }
      }
    };
    fetchUserData();
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

      const botMessage = { text: '', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      try {
        const response = await axios.post('http://localhost:5000/chatbot', {
          query: inputValue,
        });

        const botResponse = response.data.response;
        typeMessage(botResponse);
      } catch (error) {
        console.error('Error communicating with the chatbot API:', error);
        typeMessage('Sorry, there was an error processing your request.');
      }
    }
  };

  const typeMessage = (fullText) => {
    let currentIndex = 0;
    const typingSpeed = 50;

    typingIntervalRef.current = setInterval(() => {
      currentIndex += 1;
      const currentText = fullText.substring(0, currentIndex);

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages.length === 0) return updatedMessages;
        const lastMessage = { ...updatedMessages[updatedMessages.length - 1] };
        lastMessage.text = currentText;
        updatedMessages[updatedMessages.length - 1] = lastMessage;
        return updatedMessages;
      });

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
          <div className={styles.profileIcon} aria-label="User Profile" onClick={toggleProfileMenu}>
            <img
              src={`${userData.avatar}?timestamp=${avatarTimestamp}`}
              alt="User Avatar"
              className={styles.avatar}
            />
          </div>
          {isProfileMenuOpen && (
            <div className={styles.profileMenu}>
              <p className={styles.profileName}>{userData.username}</p>
              <p className={styles.profileEmail}>{userData.email}</p>
              <Link to={`/account/${localStorage.getItem('userId')}`} className={styles.manageAccount}>
                Manage your account
              </Link>
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
            <span className={styles.user}>{userData.username}</span>
            <span className={styles.exclamation}>!</span>
          </h1>
        )}
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
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
            disabled={isTyping}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isTyping}
          >
            <img src={upArrow} alt="Send" className={styles.upArrowIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultingPage;
