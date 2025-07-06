import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Set favicon programmatically
const link = document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = '/LikhoVerse.png' // Correct path for public assets
document.head.appendChild(link)

// Create a helmet context for better SSR compatibility
const helmetContext = {};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider context={helmetContext}>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
