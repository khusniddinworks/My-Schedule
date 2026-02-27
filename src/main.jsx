import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import './styles/globals.css'

// Global Error Handler for Deployment Debugging
window.onerror = function (msg, url, line, col, error) {
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="padding: 20px; color: #ff4d4d; font-family: sans-serif;">
      <h1>System Launch Error</h1>
      <pre>${msg}\nLine: ${line}\nCol: ${col}</pre>
    </div>`;
    }
    return false;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
    root.render(
        <App />
    );
} catch (e) {
    console.error("Render Crash:", e);
    document.getElementById('root').innerHTML = `<div style="padding: 20px; color: red;">Crash: ${e.message}</div>`;
}
