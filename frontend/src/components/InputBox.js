import { useState, useEffect } from 'react';
import styles from '../styles/InputBox.module.css';

export default function InputBox({ onSend, theme, onFileUpload, isUploading }) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.continuous = false; // Stop after one sentence
      recognitionInstance.interimResults = false; // Only final results

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size too large. Please upload a file smaller than 10MB.');
        return;
      }
      if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Please upload a CSV file.');
        return;
      }
      onFileUpload(file);
    }
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className={`${styles.inputContainer} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className={styles.input}
        disabled={isUploading}
      />
      <button 
        onClick={handleSend} 
        className={styles.button}
        disabled={isUploading}
      >
        <span role="img" aria-label="send">✉️</span>
      </button>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="file-upload"
        disabled={isUploading}
      />
      <label 
        htmlFor="file-upload" 
        className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}
      >
        {isUploading ? '⏳' : '📁'}
      </label>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
        disabled={isUploading}
      >
        {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
      </button>
    </div>
  );
}