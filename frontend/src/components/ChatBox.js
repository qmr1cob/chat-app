import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import { sendMessage, uploadCSV } from '../utils/api';
import styles from '../styles/ChatBox.module.css';

export default function ChatBox({ theme }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { sender: 'You', text: message, type: 'text' }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(message);
      setMessages((prev) => [...prev, { sender: 'Bot', ...response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'Bot', text: 'Sorry, something went wrong!', type: 'text' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      setMessages((prev) => [...prev, { 
        sender: 'You', 
        text: `Uploading file: ${file.name}`, 
        type: 'text' 
      }]);
      
      const response = await uploadCSV(file);
      setMessages((prev) => [...prev, { sender: 'Bot', ...response }]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'Bot', 
          text: `Failed to upload file: ${error.response?.data?.detail || 'Unknown error'}`, 
          type: 'text' 
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`${styles.chatContainer} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            text={msg.content || msg.text}
            type={msg.type}
            theme={theme}
          />
        ))}
        {(isLoading || isUploading) && (
          <div className={styles.typingIndicator}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
      </div>
      <InputBox 
        onSend={handleSend} 
        theme={theme} 
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
      />
    </div>
  );
}