import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoleFromToken, clearAuth, clearStudentAuth, clearTeacherAuth, clearAdminAuth } from '../../utils/auth';

/**
 * ProtectedRoute component ensures that only authenticated users with 
 * correct roles can access specific routes.
 * 
 * KEY FIX: We now decode the JWT token to get the ACTUAL role,
 * rather than trusting the localStorage 'role' key which can be stale.
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  // Get the role from localStorage (may be stale)
  const storedRole = localStorage.getItem('role');
  
  // Get the token that matches the stored role
  const getTokenForRole = (role) => {
    if (role === 'student') return localStorage.getItem('usertoken');
    if (role === 'admin') return localStorage.getItem('admintoken');
    if (role === 'teacher') return localStorage.getItem('teachertoken');
    return null;
  };

  // Get the appropriate token
  const roleSpecificToken = getTokenForRole(storedRole);
  const fallbackToken = localStorage.getItem('usertoken') || 
                        localStorage.getItem('admintoken') || 
                        localStorage.getItem('teachertoken') ||
                        localStorage.getItem('token');
  
  const token = roleSpecificToken || fallbackToken;
  
  // CRITICAL: Decode the token to get the ACTUAL embedded role
  const tokenRole = getRoleFromToken(token);

  useEffect(() => {
    const isValidToken = token && token !== 'null' && token !== 'undefined';
    
    console.log(`[AUTH-GUARD] Validating access...
      Path: ${location.pathname}
      Stored Role: ${storedRole}
      Token Role (from JWT): ${tokenRole}
      Has Token: ${isValidToken}
      Allowed Roles: [${allowedRoles.join(', ')}]
    `);

    // 1. If no valid token, redirect to login
    if (!isValidToken) {
      console.warn('[AUTH-GUARD] Access Denied: No valid token. Clearing session and redirecting.');
      
      const path = location.pathname.toLowerCase();
      if (path.includes('admin')) {
        clearAdminAuth();
        navigate('/admin/login', { replace: true });
      } else if (path.includes('teacher')) {
        clearTeacherAuth();
        navigate('/faculty/login', { replace: true });
      } else if (path.includes('student')) {
        clearStudentAuth();
        navigate('/student/login', { replace: true });
      } else {
        clearAuth();
        navigate('/UserLogin', { replace: true });
      }
      return;
    }

    // 2. If localStorage role doesn't match token role, fix it
    if (tokenRole && storedRole !== tokenRole) {
      console.warn(`[AUTH-GUARD] Role mismatch! Stored: ${storedRole}, Token: ${tokenRole}. Fixing localStorage...`);
      localStorage.setItem('role', tokenRole);
    }

    // 3. Use the TOKEN's role for authorization (most accurate)
    let effectiveRole = tokenRole || storedRole;

    // 🚀 PATH-BASED ROLE ENFORCEMENT
    // In case of multiple tokens, prioritize based on current path
    if (location.pathname.toLowerCase().includes('student')) {
      const studentToken = localStorage.getItem('usertoken');
      const studentRoleFromToken = getRoleFromToken(studentToken);
      if (studentRoleFromToken === 'student') {
        effectiveRole = 'student';
      }
    } else if (location.pathname.toLowerCase().includes('teacher')) {
      const teacherToken = localStorage.getItem('teachertoken');
      const teacherRoleFromToken = getRoleFromToken(teacherToken);
      if (teacherRoleFromToken === 'teacher') {
        effectiveRole = 'teacher';
      }
    } else if (location.pathname.toLowerCase().includes('admin')) {
      const adminToken = localStorage.getItem('admintoken');
      const adminRoleFromToken = getRoleFromToken(adminToken);
      if (adminRoleFromToken === 'admin') {
        effectiveRole = 'admin';
      }
    }

    // 4. If role is not allowed for this route, redirect to their correct home
    if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
      console.warn(`[AUTH-GUARD] Role "${effectiveRole}" is not authorized for [${allowedRoles.join(', ')}].`);
      
      const homeMap = {
        student: '/studentDashboard',
        admin: '/adminDashboard',
        teacher: '/teacherDashboard'
      };

      const targetHome = homeMap[effectiveRole] || '/UserLogin';
      console.log(`[AUTH-GUARD] Redirecting to correct dashboard: ${targetHome}`);
      navigate(targetHome, { replace: true });
      return;
    }

    // 5. Sync the generic 'token' key for legacy components
    if (token && localStorage.getItem('token') !== token) {
      localStorage.setItem('token', token);
    }

    setIsVerifying(false);
  }, [token, tokenRole, storedRole, navigate, allowedRoles, location.pathname]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 font-mono text-sm animate-pulse">
          Verifying credentials...
        </div>
      </div>
    );
  }

  // Final render check: Role must be allowed AND match the path context
  const getPathEffectiveRole = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('student')) {
      const t = localStorage.getItem('usertoken');
      if (getRoleFromToken(t) === 'student') return 'student';
    }
    if (path.includes('teacher')) {
      const t = localStorage.getItem('teachertoken');
      if (getRoleFromToken(t) === 'teacher') return 'teacher';
    }
    if (path.includes('admin')) {
      const t = localStorage.getItem('admintoken');
      if (getRoleFromToken(t) === 'admin') return 'admin';
    }
    return tokenRole || storedRole;
  };

  const finalRole = getPathEffectiveRole();
  const isAuthorized = (allowedRoles.length === 0 || allowedRoles.includes(finalRole));
  
  return isAuthorized ? children : null;
};

export default ProtectedRoute;
