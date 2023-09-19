import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PopupContextProvider } from './contexts/PopupContext/PopupContext'


ReactDOM.createRoot(document.getElementById('root')).render(
    <PopupContextProvider>
      <App />
    </PopupContextProvider>
)
