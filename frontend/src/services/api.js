import axios from 'axios';

// Centralized API base URL for the entire frontend.
// In production, set VITE_API_URL in your deployment environment.
const envApiUrl = import.meta?.env?.VITE_API_URL;
export const API_URL = (envApiUrl || '').replace(/\/$/, '');

if (!envApiUrl && typeof window !== 'undefined') {
    // Helpful warning for misconfigured environments.
    console.warn('VITE_API_URL is not defined. Set it in frontend .env for local use and in Vercel for production.');
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

export const loginUser = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
};

export const registerUser = async (email, password, fullName) => {
    const response = await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
    }, {
        headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export default api;
