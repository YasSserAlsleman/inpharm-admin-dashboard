import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { 
  Notifications as NotificationsIcon, 
  Comment as CommentIcon, 
  Report as ReportIcon, 
  Newspaper as NewsIcon,
  Circle as CircleIcon
} from "@mui/icons-material";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'admin_new_comment': return <CommentIcon className="text-green-500" />;
      case 'admin_report': return <ReportIcon className="text-red-500" />;
      case 'news': return <NewsIcon className="text-blue-500" />;
      default: return <NotificationsIcon className="text-gray-500" />;
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/read`, {});
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("❌ Error marking as read:", err);
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    
    // Navigate based on type
    if (n.type === 'admin_new_comment' || n.type === 'reply' || n.type === 'admin_report') {
      if (n.data?.lessonId) {
        const lessonType = n.data.lessonType;
        if (lessonType === 'virtualPharmacy') {
          navigate(`/virtualPharmacyLesson/${n.data.lessonId}/comments`);
        } else if (lessonType === 'podcast') {
          navigate(`/podcastLesson/${n.data.lessonId}/comments`);
        } else {
          navigate(`/learningLesson/${n.data.lessonId}/comments`);
        }
      }
    } else if (n.type === 'news') {
      navigate('/news');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <NotificationsIcon /> الإشعارات
        </h2>
        <button 
          onClick={fetchNotifications}
          className="text-blue-600 hover:underline text-sm"
        >
          تحديث القائمة
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">
          لا توجد إشعارات حالياً
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {notifications.map((n) => (
            <div 
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 border-b last:border-0 flex gap-4 items-start hover:bg-gray-50 cursor-pointer transition ${!n.isRead ? 'bg-blue-50/50' : ''}`}
            >
              <div className="mt-1">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold ${!n.isRead ? 'text-blue-900' : 'text-gray-700'}`}>
                    {n.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString('ar-EG', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                {!n.isRead && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <CircleIcon sx={{ fontSize: 8 }} /> غير مقروء
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
