import axios from "axios";

// Use a relative base URL in development so the Vite dev server proxy can forward requests
const CHATBOT_API_BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_CHATBOT_API_URL || "https://chatbot-service-yu32.onrender.com").replace(/\/$/, "");

const chatbotApi = axios.create({
  baseURL: CHATBOT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @typedef {{
 *   role: string,
 *   text: string,
 *   quickActions?: Array<{ label?: string, value?: string }>,
 *   emotion?: string,
 * }} ChatMessage
 */

/**
 * @typedef {{
 *   sessionId: string,
 *   welcomeMessage: ChatMessage,
 * }} StartConversationResponse
 */

export const ChatbotService = {
  /**
   * Starts a new chatbot conversation.
   * GET /api/chat/start
   * @returns {Promise<StartConversationResponse>}
   */
  startConversation: async () => {
    const { data } = await chatbotApi.get("/api/chat/start");
    return data;
  },

  /**
   * Sends a user message to the chatbot.
   * POST /api/chat/message
   * @param {{ sessionId: string, text: string }} payload
   * @returns {Promise<ChatMessage | null>}
   */
  sendMessage: async ({ sessionId, text }) => {
    const safeText = typeof text === "string" ? text.trim() : "";

    if (!sessionId) {
      throw new Error("ChatbotService.sendMessage: sessionId is required");
    }

    if (!safeText) {
      return null;
    }

    const { data } = await chatbotApi.post("/api/chat/message", {
      sessionId,
      text: safeText,
    });

    return data;
  },
};

export default ChatbotService;
