import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { App } from 'antd';
import router from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css'
import './styles/dark-mode.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </ThemeProvider>
  </React.StrictMode>,
)