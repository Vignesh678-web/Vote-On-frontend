import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { getRoleFromToken } from './utils/auth'

// 🔐 GLOBAL AXIOS CONFIGURATION
// Automatically attach token to every request if it exists
axios.interceptors.request.use(
  (config) => {
    // 1. Check if an Authorization header already exists and is valid
    let authHeader = config.headers.Authorization;
    
    // 2. If missing or invalid ("Bearer null"), resolve from context-aware keys
    if (!authHeader || authHeader === 'Bearer null' || authHeader === 'Bearer undefined') {
      const storedRole = localStorage.getItem('role');
      const path = window.location.pathname.toLowerCase();
      
      // 🚀 PATH-AWARE TOKEN SELECTION
      let activeToken = null;
      if (path.includes('student')) {
        activeToken = localStorage.getItem('usertoken');
      } else if (path.includes('teacher')) {
        activeToken = localStorage.getItem('teachertoken');
      } else if (path.includes('admin')) {
        activeToken = localStorage.getItem('admintoken');
      }

      // Fallback to role-based or any available token
      if (!activeToken) {
        activeToken = (storedRole === 'student' ? localStorage.getItem('usertoken') : null) || 
                      (storedRole === 'admin'   ? localStorage.getItem('admintoken') : null) || 
                      (storedRole === 'teacher' ? localStorage.getItem('teachertoken') : null) ||
                      localStorage.getItem('usertoken') || 
                      localStorage.getItem('admintoken') || 
                      localStorage.getItem('teachertoken');
      }

      // Double-check role from token for security sync
      const tokenRole = getRoleFromToken(activeToken);
      if (tokenRole && storedRole !== tokenRole) {
        localStorage.setItem('role', tokenRole);
      }

      if (activeToken && activeToken !== 'null' && activeToken !== 'undefined') {
        config.headers.Authorization = `Bearer ${activeToken}`;
        
        //  BACKWARD COMPATIBILITY BRIDGE:
        // Automatically sync to 'token' if it's missing or mismatching
        if (localStorage.getItem('token') !== activeToken) {
          localStorage.setItem('token', activeToken);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gracefully handle 401 Unauthorized (Expired/Invalid Token)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError = error.response && error.response.status === 401;
    const path = window.location.pathname.toLowerCase();
    const isLoginPath = path === '/' || path === '/userlogin' || path.includes('/login') || path.includes('otp');

    if (isAuthError && !isLoginPath) {
      console.warn("Session expired or unauthorized. Logging out...");
      
      const keysToRemove = ["token", "usertoken", "admintoken", "teachertoken", "role", "student", "admin", "teacher", "userId"];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      setTimeout(() => {
        let target = '/UserLogin';
        if (path.includes('admin')) target = '/admin/login';
        else if (path.includes('teacher')) target = '/faculty/login';
        else if (path.includes('student')) target = '/student/login';
        
        window.location.href = target; 
      }, 100);
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
