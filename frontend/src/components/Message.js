import { useEffect } from 'react';
import styles from '../styles/Message.module.css';
import ReactMarkdown from 'react-markdown';

export default function Message({ sender, text, type, theme }) {
  const renderContent = () => {
    switch (type) {
      case 'code':
        // Extract language and code content
        const codeMatch = text.match(/```(\w+)?\n?([\s\S]*?)```/);
        const language = codeMatch?.[1] || '';
        const code = codeMatch?.[2] || text;
        return (
          <pre className={styles.codeBlock}>
            {language && <div className={styles.codeLanguage}>{language}</div>}
            <code>{code}</code>
          </pre>
        );
      case 'heading':
        return <h2 className={styles.heading}>{text.replace(/^#+\s/, '')}</h2>;
      case 'list':
        return (
          <div className={styles.list}>
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        );
      default:
        return (
          <div className={styles.paragraph}>
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        );
    }
  };

  return (
    <div className={`${styles.message} ${sender === 'You' ? styles.userMessage : styles.botMessage}`}>
      <div className={`${styles.messageContent} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <div className={styles.sender}>{sender}</div>
        {renderContent()}
      </div>
    </div>
  );
}