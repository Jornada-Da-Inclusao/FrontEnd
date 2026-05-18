import React from "react";
import styles from "./chat.module.css";

const ChatMessage = ({ message, onQuickAction }) => {
  const isUser = (message.role || "").toLowerCase() === "user";
  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.bot}`} aria-live="off">
      <div className={styles.bubble}>{message.text}</div>
      {message.quickActions && message.quickActions.length > 0 && (
        <div className={styles.quickActions}>
          {message.quickActions.map((q, idx) => (
            <button
              key={idx}
              className={styles.quickBtn}
              onClick={() => onQuickAction(q.value ?? q.label)}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
