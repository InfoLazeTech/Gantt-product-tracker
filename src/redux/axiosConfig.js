import axios from "axios";
import { store } from "./store";

const axiosConfig = axios.create({
  // baseURL: 'http://localhost:3001/api/',
  baseURL: "https://gantt-tracker-backend.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error("Axios error:", error.response || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
