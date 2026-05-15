import { io } from "socket.io-client";
import { BASE_FILE_URL } from "../config/config";

// تهيئة الاتصال بالخادم
const socket = io(BASE_FILE_URL, {
  autoConnect: false, // لا يتصل تلقائياً إلا بعد تسجيل الدخول
});

export default socket;
