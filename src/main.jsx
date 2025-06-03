import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import * as React from 'react'
import ScrollButton from './components/scrollButton/ScrollButton.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ScrollButton />
  </StrictMode>
)
