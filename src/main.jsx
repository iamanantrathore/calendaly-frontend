import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './api' // ensure axios global baseURL is initialized
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
