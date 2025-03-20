import { useState } from 'react';
import ChatBox from '../components/ChatBox';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>AI Chat Assistant</h1>
          <p className={styles.subtitle}>My Playground</p>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>
      <main className={styles.main}>
        <ChatBox theme={theme} />
      </main>
      <footer className={styles.footer}>
  <p>© 2025 AI Chat Assistant. All rights reserved.</p>
  <p>Built by saranish</p>
</footer>

    </div>
  );
}