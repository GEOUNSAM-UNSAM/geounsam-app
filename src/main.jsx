import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AccessProvider } from './context/AccessContext'
import { NotificationsProvider } from './context/NotificationsContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AccessProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </AccessProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
