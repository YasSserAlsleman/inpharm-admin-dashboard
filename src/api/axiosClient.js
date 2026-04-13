import axios from 'axios'
import { BASE_API_URL } from '../config/config';  // أضف هذا في الأعلى


 
const axiosClient = axios.create({
  baseURL: BASE_API_URL,
    withCredentials: true, // ✅ مهم
})

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


axiosClient.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.status === 403) {
      alert("ليس لديك صلاحية لتنفيذ هذه العملية");
    }

    return Promise.reject(error);
  }
);


export default axiosClient
