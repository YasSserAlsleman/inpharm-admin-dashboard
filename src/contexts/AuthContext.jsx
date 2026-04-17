import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axiosClient';
import { generateDeviceFingerprint } from '../utils/fingerprint';

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
    const deviceId = generateDeviceFingerprint();
    try {
      const res = await axios.post('/auth/login', { email, password, deviceId, deviceType: 'web' });
      const { token } = res.data;
      localStorage.setItem('token', token);

      // جلب بيانات المستخدم بعد تسجيل الدخول
      const currentUser = await fetchCurrentUser(token);

      if (!currentUser) {
        throw new Error('Access denied: only admins or managers can login');
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.message?.includes('جهاز آخر')) {
        throw new Error('تم تسجيل الدخول من جهاز آخر. يُسمح بتسجيل الدخول من جهاز واحد فقط.');
      }
      throw error;
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