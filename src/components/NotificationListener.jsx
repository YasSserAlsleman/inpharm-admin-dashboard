import React, { useEffect } from 'react';
import socket from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';

const NotificationListener = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const joinAdminRoom = () => socket.emit('join-admin');

    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'manager')) {
      // الاتصال بالسوكت وانضمام لغرفة الإدارة
      socket.auth = { token: localStorage.getItem('token') };
      socket.connect();

      socket.on('connect', joinAdminRoom);

      // الاستماع للإشعارات الجديدة
      socket.on('new-notification', (data) => {
        console.log("🔔 New Admin Notification:", data);
        
        window.dispatchEvent(new Event('notifications-updated'));
        window.dispatchEvent(new CustomEvent('new-notification-local', { detail: data }));
      });
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off('new-notification');
      socket.off('connect', joinAdminRoom);
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  return null; // هذا المكون لا يعرض شيئاً بنفسه
};

export default NotificationListener;
