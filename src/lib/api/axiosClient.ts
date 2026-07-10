import axios from "axios";

// Determine base URL depending on environment
// For local development, assume Django runs on localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add Authorization token if available
axiosClient.interceptors.request.use(
  (config) => {
    // Check if running on the client side (localStorage is not available on the server)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling global errors (like 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Here you can handle global token refreshing logic if necessary
    // E.g., if error.response.status === 401 && !originalRequest._retry
    return Promise.reject(error);
  }
);

export default axiosClient;
