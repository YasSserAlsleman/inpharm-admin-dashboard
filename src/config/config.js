// ملف الإعدادات المركزي للروابط والمتغيرات العامة
// export const BASE_API_URL = 'https://inpharm-admin-backend.onrender.com/api';  // للـ API (من axiosClient.js)
// export const BASE_FILE_URL = 'https://inpharm-admin-backend.onrender.com';  // للملفات المرفوعة (الصور، الفيديوهات، إلخ)
// export const BASE_API_URL = import.meta.env.VITE_API_URL || 'https://inpharm-admin-backend.onrender.com/api';  // للـ API (من axiosClient.js)
// export const BASE_FILE_URL = import.meta.env.VITE_FILE_URL || 'https://inpharm-admin-backend.onrender.com';  // للملفات المرفوعة (الصور، الفيديوهات، إلخ)    

export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://49.13.227.103:5000/api';  // للـ API (من axiosClient.js)
export const BASE_FILE_URL = import.meta.env.VITE_FILE_URL || 'http://49.13.227.103:5000';  // للملفات المرفوعة (الصور، الفيديوهات، إلخ)    
