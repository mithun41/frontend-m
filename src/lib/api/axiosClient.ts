import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// Determine base URL depending on environment
// For local development, assume Django runs on localhost:8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

// Request Interceptor to add Authorization token if available
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token = useAuthStore.getState().accessToken;
      if (!token) {
        token = localStorage.getItem("accessToken");
      }
      if (!token) {
        try {
          const authStorage = localStorage.getItem("auth-storage");
          if (authStorage && authStorage.trim().startsWith("{")) {
            const parsed = JSON.parse(authStorage);
            token = parsed?.state?.accessToken || null;
          }
        } catch {
          // ignore error
        }
      }
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
    const isAuthEndpoint = 
      error.config?.url?.includes('/login') || 
      error.config?.url?.includes('/register') || 
      error.config?.url?.includes('/forgot-password') || 
      error.config?.url?.includes('/reset-password');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAuthPage = 
          currentPath.includes('/login') || 
          currentPath.includes('/register') || 
          currentPath.includes('/forgot-password') || 
          currentPath.includes('/reset-password');

        if (!isAuthPage && !isRedirecting) {
          isRedirecting = true;
          useAuthStore.getState().logout();
          window.location.href = "/login";
          setTimeout(() => {
            isRedirecting = false;
          }, 3000);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
