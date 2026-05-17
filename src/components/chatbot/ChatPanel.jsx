import React, { useEffect, useRef, useState } from "react";
import useChatbot from "../../hooks/useChatbot";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import styles from "./chat.module.css";

const ChatPanel = () => {
  const { messages, sendMessage, startChat, loading, sending, resetChat, error } = useChatbot();
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && messages.length === 0 && !loading) {
      void startChat();
    }
  }, [open, messages.length, loading, startChat]);

  useEffect(() => {
    if (listRef.current) {
      // @ts-ignore DOM typing in JS file
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text) => {
    if (!text) return;
    sendMessage(text);
  };

  const handleQuickAction = (value) => sendMessage(value);

  return (
    <>
      {!open && (
        <button
          className={styles.avatarBtn}
          aria-label="Abrir assistente"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className={styles.avatarEmoji} aria-hidden>💬</span>
        </button>
      )}

      {open && (
        <aside className={styles.panel} aria-label="Assistente" role="region">
          <header className={styles.header}>
            <h2>Ajuda</h2>
            <div>
              <button onClick={() => setOpen(false)} className={styles.reset} aria-label="Fechar">Fechar</button>
              <button onClick={resetChat} className={styles.reset} aria-label="Reiniciar conversa">Reiniciar</button>
            </div>
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
          </div>

          <ChatInput onSend={handleSend} disabled={sending} />
        </aside>
      )}
    </>
  );
};

export default ChatPanel;
