// src/pages/AIConsultingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../pages/AIConsultingPage.module.css';
import menuIcon from '../assets/menu.png';
import upArrow from '../assets/up-arrow.png';
import settingsIcon from '../assets/settings.png';
import privacyIcon from '../assets/privacy.png';
import helpIcon from '../assets/help.png';
import addSwitchIcon from '../assets/add-switch.png';
import defaultAvatar from '../assets/avatar.png';
import Navbar from '../components/common/Navbar';

const AIConsultingPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: 'User',
    email: 'user@example.com',
    avatar: defaultAvatar,
    avatarTimestamp: new Date().getTime(),
  });
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [firstMessages, setFirstMessages] = useState({});
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
            avatarTimestamp: new Date().getTime(),
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData((prevData) => ({
            ...prevData,
            avatar: defaultAvatar,
            avatarTimestamp: new Date().getTime(),
          }));
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchChatSessions = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/api/chat/sessions', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setChatSessions(response.data);

          // Fetch first message for each session
          const firstMessagePromises = response.data.map(session =>
            axios.get(`http://localhost:4000/api/chat/sessions/${session._id}/messages`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { limit: 1, sort: 'asc' } // Giả sử backend hỗ trợ phân trang và sắp xếp
            })
          );

          const firstMessagesResponses = await Promise.all(firstMessagePromises);
          const firstMessagesMap = {};
          firstMessagesResponses.forEach((res, index) => {
            const sessionId = response.data[index]._id;
            firstMessagesMap[sessionId] = res.data.length > 0 ? res.data[0].text : 'New Chat Session';
          });

          setFirstMessages(firstMessagesMap);

          if (response.data.length > 0) {
            setCurrentSession(response.data[0]._id);
            fetchChatMessages(response.data[0]._id);
          }
        } catch (error) {
          console.error('Error fetching chat sessions or messages:', error);
        }
      }
    };
    fetchChatSessions();
  }, []);

  const fetchChatMessages = async (sessionId) => {
    const token = localStorage.getItem('token');
    if (token && sessionId) {
      try {
        const response = await axios.get(`http://localhost:4000/api/chat/sessions/${sessionId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    }
  };

  const createNewChatSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/chat/sessions',
          { title: 'New Chat Session' }, // Bạn có thể mở rộng để người dùng nhập tiêu đề
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChatSessions([response.data, ...chatSessions]);
        setCurrentSession(response.data._id);
        setMessages([]);
        setGreetingVisible(true);
        setFirstMessages(prev => ({
          ...prev,
          [response.data._id]: 'New Chat Session'
        }));
      } catch (error) {
        console.error('Error creating new chat session:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() !== '' && currentSession) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue('');
      setGreetingVisible(false);
      setIsTyping(true);

      // Save user message to backend
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:4000/api/chat/sessions/${currentSession}/messages`,
          { text: inputValue, sender: 'user' },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Kiểm tra nếu phiên trò chuyện chưa có tiêu đề hợp lệ
        if (firstMessages[currentSession] === 'New Chat Session') {
          await axios.put(
            `http://localhost:4000/api/chat/sessions/${currentSession}`,
            { title: inputValue },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Cập nhật tiêu đề trong state
          setFirstMessages(prev => ({
            ...prev,
            [currentSession]: inputValue
          }));
        }
      } catch (error) {
        console.error('Error saving user message:', error);
      }

      const botMessage = { text: '', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      try {
        const response = await axios.post('http://localhost:5000/chatbot', {
          query: inputValue,
        });

        const botResponse = response.data.response;
        typeMessage(botResponse);

        // Save bot message to backend
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:4000/api/chat/sessions/${currentSession}/messages`,
          { text: botResponse, sender: 'bot' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error communicating with the chatbot API:', error);
        typeMessage('Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.');

        // Save error message to backend
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:4000/api/chat/sessions/${currentSession}/messages`,
          { text: 'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.', sender: 'bot' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    }
  };

  const typeMessage = (fullText) => {
    let currentIndex = 0;
    const typingSpeed = 20;

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

  const toggleHistorySidebar = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const switchChatSession = (sessionId) => {
    setCurrentSession(sessionId);
    fetchChatMessages(sessionId);
    setMessages([]);
    setGreetingVisible(true);
  };

  return (
    <div className={styles.aiConsultingPage}>
      {/* History Sidebar */}
      <div className={`${styles.historySidebar} ${isHistoryOpen ? styles.open : ''}`}>
        <h2>Conversation History</h2>
        {isHistoryOpen && (
          <button className={styles.newChatButton} onClick={createNewChatSession}>
            New Chat
          </button>
        )}
        <div className={styles.chatSessionList}>
          {chatSessions.map((session) => (
            <div
              key={session._id}
              className={`${styles.chatSessionItem} ${currentSession === session._id ? styles.activeSession : ''}`}
              onClick={() => switchChatSession(session._id)}
            >
              <span className={styles.chatSessionTitle}>{firstMessages[session._id]}</span>
              {isHistoryOpen && (
                <span className={styles.chatSessionDate}>
                  {new Date(session.createdAt).toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Sidebar */}
      <div className={styles.sidebar}>
        <button
          className={styles.menuButton}
          aria-label="Toggle History Sidebar"
          onClick={toggleHistorySidebar}
        >
          <img src={menuIcon} alt="Menu" className={styles.menuIcon} />
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sử dụng Navbar component và truyền prop isHistoryOpen */}
        <Navbar userData={userData} toggleProfileMenu={toggleProfileMenu} isHistoryOpen={isHistoryOpen} />

        {/* Menu Profile */}
        {isProfileMenuOpen && (
          <div className={styles.profileMenu}>
            <p className={styles.profileName}>{userData.username}</p>
            <p className={styles.profileEmail}>{userData.email}</p>
            <Link to={`/account/${localStorage.getItem('userId')}`} className={styles.manageAccount}>
              Quản lý tài khoản
            </Link>
            <div className={styles.profileMenuOptions}>
              <Link to="/settings" className={styles.profileMenuItem}>
                <img src={settingsIcon} alt="Settings Icon" className={styles.menuIcon} /> Cài đặt
              </Link>
              <Link to="/privacy" className={styles.profileMenuItem}>
                <img src={privacyIcon} alt="Privacy Icon" className={styles.menuIcon} /> Quyền riêng tư
              </Link>
              <Link to="/help" className={styles.profileMenuItem}>
                <img src={helpIcon} alt="Help Icon" className={styles.menuIcon} /> Trợ giúp
              </Link>
              <Link to="/switch-accounts" className={styles.profileMenuItem}>
                <img src={addSwitchIcon} alt="Add or Switch Accounts Icon" className={styles.menuIcon} /> Thêm hoặc chuyển tài khoản
              </Link>
            </div>
            <button className={styles.logout}>Đăng xuất</button>
          </div>
        )}

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
            disabled={isTyping || !currentSession}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isTyping || !currentSession}
          >
            <img src={upArrow} alt="Send" className={styles.upArrowIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultingPage;
