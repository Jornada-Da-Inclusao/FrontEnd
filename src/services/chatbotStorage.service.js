const CHATBOT_SESSION_ID_KEY = "chatbot_session_id";
const CHATBOT_HISTORY_KEY = "chatbot_history";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const ChatbotStorageService = {
  getSessionId: () => localStorage.getItem(CHATBOT_SESSION_ID_KEY),

  setSessionId: (sessionId) => {
    if (!sessionId) {
      localStorage.removeItem(CHATBOT_SESSION_ID_KEY);
      return;
    }

    localStorage.setItem(CHATBOT_SESSION_ID_KEY, sessionId);
  },

  clearSessionId: () => {
    localStorage.removeItem(CHATBOT_SESSION_ID_KEY);
  },

  getHistory: () => safeParse(localStorage.getItem(CHATBOT_HISTORY_KEY), []),

  setHistory: (history) => {
    localStorage.setItem(CHATBOT_HISTORY_KEY, JSON.stringify(history || []));
  },

  pushMessage: (message) => {
    const history = ChatbotStorageService.getHistory();
    history.push(message);
    ChatbotStorageService.setHistory(history);
    return history;
  },

  clearHistory: () => {
    localStorage.removeItem(CHATBOT_HISTORY_KEY);
  },

  clearAll: () => {
    ChatbotStorageService.clearSessionId();
    ChatbotStorageService.clearHistory();
  },
};

export default ChatbotStorageService;
