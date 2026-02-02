import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

// 🔐 GLOBAL AXIOS CONFIGURATION
// Automatically attach token to every request if it exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gracefully handle 401 Unauthorized (Expired/Invalid Token)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.clear(); // Clear all auth data
      if (window.location.pathname !== '/' && window.location.pathname !== '/UserLogin') {
        window.location.href = '/UserLogin'; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <App />

    </BrowserRouter>
  </StrictMode>,
)
