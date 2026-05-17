import React, { useEffect, useRef } from "react";
import useChatbot from "../../hooks/useChatbot";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import styles from "./chat.module.css";

const ChatPanel = () => {
  const { messages, sendMessage, startChat, loading, sending, resetChat, error } = useChatbot();
  const listRef = useRef(null);

  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (text) => {
    if (!text) return;
    sendMessage(text);
  };

  const handleQuickAction = (value) => sendMessage(value);

  return (
    <aside className={styles.panel} aria-label="Assistente" role="region">
      <header className={styles.header}>
        <h2>Ajuda</h2>
        <button onClick={resetChat} className={styles.reset} aria-label="Reiniciar conversa">Reiniciar</button>
      </header>

      <div className={styles.messages} ref={listRef} role="log" aria-live="polite">
        {loading && <div className={styles.empty}>Carregando...</div>}
        {error && <div className={styles.error}>Erro: {String(error?.message || error)}</div>}
        {!loading && !error && messages.length === 0 && (
          <div className={styles.empty}>Inicie uma conversa</div>
        )}

        {!loading && !error && messages.map((m, i) => (
          <ChatMessage key={i} message={m} onQuickAction={handleQuickAction} />
        ))}

        {/* debug dump removed */}
      </div>

      <ChatInput onSend={handleSend} disabled={sending} />
    </aside>
  );
};

export default ChatPanel;
