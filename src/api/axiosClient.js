import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'https://inpharm-admin-backend.onrender.com/api'

const axiosClient = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' },
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
