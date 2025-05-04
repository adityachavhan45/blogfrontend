import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Set favicon programmatically
const link = document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = '/LikhoVerse.png' // Correct path for public assets
document.head.appendChild(link)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
