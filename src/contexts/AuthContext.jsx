import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axiosClient';
import { generateDeviceFingerprint } from '../utils/fingerprint';

const legacyAliases = {
  'lessons.create': 'addLesson', 'lessons.update': 'updateLesson', 'lessons.delete': 'deleteLesson',
  'topics.create': 'addMainTopic', 'topics.update': 'updateMainTopic', 'topics.delete': 'deleteMainTopic',
  'research.create': 'addResearch', 'research.update': 'updateResearch', 'research.delete': 'deleteResearch',
  'lectures.create': 'addLecture', 'lectures.update': 'updateLecture', 'lectures.delete': 'deleteLecture',
  'questions.create': 'addQuestion', 'questions.update': 'updateQuestion', 'questions.delete': 'deleteQuestion',
  'news.create': 'addNews', 'news.update': 'updateNews', 'news.delete': 'deleteNews',
  'subNews.create': 'addSubNews', 'subNews.update': 'updateSubNews', 'subNews.delete': 'deleteSubNews',
  'codes.create': 'generateCodes', 'plans.create': 'generatePlans', 'plans.update': 'updatePlans', 'plans.delete': 'deletePlans',
  'users.delete': 'deleteUser', 'managers.create': 'createManager', 'managers.delete': 'deleteManager',
  'students.delete': 'deleteUser',
  'managers.permissions': 'updateManagerPermissions', 'users.role': 'changeUserRole',
  'comments.delete': 'deleteComment', 'settings.update': 'updateAppSettings', 'about.create': 'addAbout'
};

const operationStorageAliases = {
  'students.update': 'updateStudents', 'students.delete': 'deleteStudents',
  'sections.create': 'createSections', 'sections.update': 'updateSections', 'sections.delete': 'deleteSections'
};

const viewStorageAliases = {
  'lessons.view': 'viewLessons', 'topics.view': 'viewTopics', 'research.view': 'viewResearch',
  'lectures.view': 'viewLectures', 'questions.view': 'viewQuestions', 'news.view': 'viewNews',
  'subNews.view': 'viewSubNews', 'codes.view': 'viewCodes', 'plans.view': 'viewPlans',
  'students.view': 'viewStudents', 'managers.view': 'viewManagers', 'about.view': 'viewAbout',
  'sections.view': 'viewSections', 'notifications.view': 'viewNotifications'
  , 'dashboard.view': 'dashboardView'
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;
const [loading, setLoading] = useState(true);
  // تحقق من وجود token عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token). finally(() => setLoading(false)) ;
    }else {
      setLoading(false);
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
        return null; // إرجاع null للمستخدم غير المسموح
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

  const can = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const legacyPermission = legacyAliases[permission];
    const operationStoragePermission = operationStorageAliases[permission];
    if (user.permissions?.[permission] || (legacyPermission && user.permissions?.[legacyPermission]) ||
      (operationStoragePermission && user.permissions?.[operationStoragePermission]) ||
      user.permissions?.[viewStorageAliases[permission]]) return true;
    if (permission.endsWith('.view')) {
      const resource = permission.slice(0, -5);
      return Object.keys(user.permissions || {}).some((key) =>
        ((key.startsWith(`${resource}.`) && key !== permission) ||
          Object.entries(legacyAliases).some(([operation, oldKey]) =>
            operation.startsWith(`${resource}.`) && oldKey === key)) &&
        user.permissions[key]
      );
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, can }}>
      {children}
    </AuthContext.Provider>
  );
};

  export const useAuth = () => useContext(AuthContext);