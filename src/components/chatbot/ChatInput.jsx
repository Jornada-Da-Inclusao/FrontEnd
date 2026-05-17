import React, { useState } from "react";
import styles from "./chat.module.css";

const ChatInput = ({ onSend, disabled = false }) => {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form className={styles.inputForm} onSubmit={submit}>
      <label htmlFor="chat-input" className={styles.srOnly}>
        Escreva sua mensagem
      </label>
      <input
        id="chat-input"
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite sua pergunta..."
        disabled={disabled}
        aria-label="Mensagem"
      />
      <button type="submit" className={styles.send} disabled={disabled || !text.trim()}>
        Enviar
      </button>
    </form>
  );
};

export default ChatInput;
