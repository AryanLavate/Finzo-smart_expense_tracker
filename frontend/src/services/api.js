import axios from 'axios';

// Centralized API base URL for the entire frontend.
// In production, set VITE_API_URL in your deployment environment.
const envApiUrl = import.meta?.env?.VITE_API_URL;
export const API_URL = envApiUrl || 'http://127.0.0.1:8000';

if (!envApiUrl && typeof window !== 'undefined') {
    // Helpful warning for misconfigured environments.
    console.warn('VITE_API_URL is not defined. Falling back to http://127.0.0.1:8000');
}

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
