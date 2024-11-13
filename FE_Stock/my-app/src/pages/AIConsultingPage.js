import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import styles from '../pages/AIConsultingPage.module.css';
import menuIcon from '../assets/menu.png';
import upArrow from '../assets/up-arrow.png';
import defaultAvatar from '../assets/avatar.png';

const AIConsultingPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [messages, setMessages] = useState([]);
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

  const toggleHistorySidebar = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

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

          const firstMessagePromises = response.data.map(session =>
            axios.get(`http://localhost:4000/api/chat/sessions/${session._id}/messages`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { limit: 1, sort: 'asc' }
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
          { title: 'New Chat Session' },
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

  const switchChatSession = (sessionId) => {
    setCurrentSession(sessionId);
    fetchChatMessages(sessionId);
    setMessages([]);
    setGreetingVisible(true);
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
  
      try {
        const token = localStorage.getItem('token');
        // Send the user message to the server
        await axios.post(
          `http://localhost:4000/api/chat/sessions/${currentSession}/messages`,
          { text: inputValue, sender: 'user' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Fetch AI response from your AI server or API
        const aiResponse = await axios.post('http://localhost:4000/api/ai/respond', { query: inputValue });
        
        // Add AI's response to the chat
        const botMessage = { text: aiResponse.data.response, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        
      } catch (error) {
        console.error('Error handling message:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };  

  return (
    <div className={styles.aiConsultingPage}>
      <Navbar />
      {/* History Sidebar */}
      <div className={`${styles.historySidebar} ${isHistoryOpen ? styles.open : ''}`}>
        <h2>Conversation History</h2>
        <button className={styles.newChatButton} onClick={createNewChatSession}>New Chat</button>
        <div className={styles.chatSessionList}>
          {chatSessions.map((session) => (
            <div
              key={session._id}
              className={`${styles.chatSessionItem} ${currentSession === session._id ? styles.activeSession : ''}`}
              onClick={() => switchChatSession(session._id)}
            >
              <span className={styles.chatSessionTitle}>{firstMessages[session._id]}</span>
              <span className={styles.chatSessionDate}>
                {new Date(session.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Button for Sidebar inside Navbar */}
      <button className={styles.menuButton} onClick={toggleHistorySidebar}>
        <img src={menuIcon} alt="Menu" className={styles.menuIcon} />
      </button>

      {/* Greeting */}
      {greetingVisible && (
        <h1>
          <span className={styles.hello}>Hello </span>
          <span className={styles.user}>{userData.username}</span>
          <span className={styles.exclamation}>!</span>
        </h1>
      )}

      {/* Messages Container */}
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
          >
            {message.text}
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

      {/* Chat Input */}
      <div className={styles.chatInputContainer}>
        <textarea
          placeholder="Ask AI Consulting..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
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
  );
};

export default AIConsultingPage
