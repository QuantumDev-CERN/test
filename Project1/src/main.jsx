import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// <-- We NO LONGER import ChatProvider -->

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <-- We NO LONGER wrap App in <ChatProvider> --> */}
    <App />
  </React.StrictMode>,
)