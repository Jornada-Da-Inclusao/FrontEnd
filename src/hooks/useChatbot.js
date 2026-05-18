import { useCallback, useEffect, useMemo, useState } from "react";
import ChatbotService from "../services/chatbot.service";
import ChatbotStorageService from "../services/chatbotStorage.service";

const normalizeBotMessage = (message) => ({
  role: message?.role || "BOT",
  text: message?.text || "",
  quickActions: message?.quickActions || [],
  emotion: message?.emotion || "NEUTRAL",
});

const normalizeUserMessage = (text) => ({
  role: "USER",
  text,
  quickActions: [],
  emotion: "NEUTRAL",
});

export function useChatbot() {
  const [sessionId, setSessionId] = useState(() => ChatbotStorageService.getSessionId());
  const [messages, setMessages] = useState(() => ChatbotStorageService.getHistory());
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const persistMessages = useCallback((nextMessages) => {
    setMessages(nextMessages);
    ChatbotStorageService.setHistory(nextMessages);
  }, []);

  const startChat = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ChatbotService.startConversation();
      const nextSessionId = response?.sessionId || null;
      const welcomeMessage = normalizeBotMessage(response?.welcomeMessage);
      const initialMessages = [welcomeMessage];

      if (nextSessionId) {
        setSessionId(nextSessionId);
        ChatbotStorageService.setSessionId(nextSessionId);
      }

      persistMessages(initialMessages);
      return response;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [persistMessages]);

  const sendMessage = useCallback(
    async (text) => {
      const safeText = typeof text === "string" ? text.trim() : "";

      if (!safeText) {
        return null;
      }

      let activeSessionId = sessionId;

      if (!activeSessionId) {
        const startedConversation = await startChat();
        activeSessionId = startedConversation?.sessionId || ChatbotStorageService.getSessionId();
      }

      if (!activeSessionId) {
        throw new Error("Chatbot session could not be initialized");
      }

      setSending(true);
      setError(null);

      const userMessage = normalizeUserMessage(safeText);
      const nextMessages = [...messages, userMessage];
      persistMessages(nextMessages);

      try {
        const botResponse = await ChatbotService.sendMessage({
          sessionId: activeSessionId,
          text: safeText,
        });

        const normalizedBotResponse = normalizeBotMessage(botResponse);
        const finalMessages = [...nextMessages, normalizedBotResponse];
        persistMessages(finalMessages);

        return normalizedBotResponse;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setSending(false);
      }
    },
    [messages, persistMessages, sessionId, startChat]
  );

  const resetChat = useCallback(async () => {
    ChatbotStorageService.clearAll();
    setSessionId(null);
    persistMessages([]);
    setError(null);
    return startChat();
  }, [persistMessages, startChat]);

  useEffect(() => {
    if (sessionId || messages.length > 0) {
      return;
    }

    void startChat();
  }, [messages.length, sessionId, startChat]);

  return useMemo(
    () => ({
      sessionId,
      messages,
      loading,
      sending,
      error,
      startChat,
      sendMessage,
      resetChat,
      hasSession: Boolean(sessionId),
      isEmpty: messages.length === 0,
    }),
    [error, loading, messages, resetChat, sendMessage, sessionId, sending, startChat]
  );
}

export default useChatbot;
