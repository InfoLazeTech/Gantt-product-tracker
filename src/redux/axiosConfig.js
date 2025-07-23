import axios from "axios";

const axiosConfig = axios.create({
    // baseURL: 'http://localhost:3001/api/',
    baseURL:'https://gantt-tracker-backend.vercel.app/',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
// Optional: Request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    // You can add additional config here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can globally handle errors here if needed
    console.error("Axios error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosConfig;
