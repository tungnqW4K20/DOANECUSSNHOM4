import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { App } from 'antd'
import { ThemeProvider } from './contexts/ThemeContext'
import router from './routes'
import './index.css'
import './styles/dark-mode.css'

// Import notification demo for testing (remove in production)
import './utils/notificationDemo'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </ThemeProvider>
  </React.StrictMode>,
)