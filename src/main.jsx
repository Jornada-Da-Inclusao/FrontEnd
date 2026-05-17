import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import * as React from 'react'
import ScrollButton from './components/scrollButton/ScrollButton.jsx'
import ChatPanel from './components/chatbot/ChatPanel.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ScrollButton />
    <ChatPanel />
  </StrictMode>
)
