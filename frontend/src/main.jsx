import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#141c36',
          color: '#f1f5f9',
          border: '1px solid #2e3d6e',
          borderRadius: '12px',
        },
      }}
    />
    <App />
  </React.StrictMode>,
)
