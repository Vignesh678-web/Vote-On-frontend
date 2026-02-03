/**
 * Utility to get the active token from localStorage,
 * checking all possible role-specific keys.
 */
export const getActiveToken = () => {
  return localStorage.getItem('usertoken') || 
         localStorage.getItem('admintoken') || 
         localStorage.getItem('teachertoken') ||
         localStorage.getItem('token');
};

/**
 * Utility to check if a valid session exists
 */
export const isAuthenticated = () => {
  const token = getActiveToken();
  return !!(token && token !== 'null' && token !== 'undefined');
};

/**
 * Clear all auth data
 */
/**
 * Clear all auth data (Nuclear option)
 */
export const clearAuth = () => {
  const keysToRemove = ["token", "usertoken", "admintoken", "teachertoken", "role", "student", "admin", "teacher", "userId"];
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

export const clearStudentAuth = () => {
  ["usertoken", "student", "userId", "token", "role"].forEach(k => localStorage.removeItem(k));
};

export const clearTeacherAuth = () => {
  ["teachertoken", "teacher", "token", "role"].forEach(k => localStorage.removeItem(k));
};

export const clearAdminAuth = () => {
  ["admintoken", "admin", "token", "role"].forEach(k => localStorage.removeItem(k));
};

/**
 * Decode a JWT token and extract its payload (without verification)
 * Used for client-side role validation
 */
export const decodeToken = (token) => {
  try {
    if (!token || token === 'null' || token === 'undefined') return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (e) {
    console.error('[AUTH] Failed to decode token:', e);
    return null;
  }
};

/**
 * Get the role embedded in a JWT token
 */
export const getRoleFromToken = (token) => {
  const payload = decodeToken(token);
  return payload?.role || null;
};
