import React, { useEffect } from 'react';
import socket from '../utils/socket';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';

const NotificationListener = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'manager')) {
      // الاتصال بالسوكت وانضمام لغرفة الإدارة
      socket.connect();
      socket.emit('join-admin');

      // الاستماع للإشعارات الجديدة
      socket.on('new-notification', (data) => {
        console.log("🔔 New Admin Notification:", data);
        
        window.dispatchEvent(new Event('notifications-updated'));
        window.dispatchEvent(new CustomEvent('new-notification-local', { detail: data }));

        // إظهار تنبيه مرئي (Toast)
        Swal.fire({
          title: data.title,
          text: data.body,
          icon: data.type === 'admin_report' ? 'warning' : 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
            // تشغيل صوت تنبيه بسيط إذا أردت
          }
        });
      });
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off('new-notification');
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  return null; // هذا المكون لا يعرض شيئاً بنفسه
};

export default NotificationListener;
