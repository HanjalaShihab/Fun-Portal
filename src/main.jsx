// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Make sure this imports your updated index.css
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)