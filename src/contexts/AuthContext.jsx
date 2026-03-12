import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  // تحقق من وجود token عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const res = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
    const currentUser = res.data;
      // تحقق من الدور
      if (!['admin', 'manager'].includes(res.data.role)) {
        logout();
        return;
      }

      setUser(currentUser);
          return currentUser; // إرجاع المستخدم المسموح

    } catch (err) {
      console.error('Failed to fetch current user', err);
      logout();
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);

    // جلب بيانات المستخدم بعد تسجيل الدخول
    const currentUser = await fetchCurrentUser(token);

    if (!currentUser) {
      throw new Error('Access denied: only admins or managers can login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

  export const useAuth = () => useContext(AuthContext);