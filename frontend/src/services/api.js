import axios from 'axios';

// Resolve the API base URL in a way that works in local dev
// and in production deployments.
const getApiBaseUrl = () => {
    // 1) Highest priority: explicit env variable from Vite
    const envUrl = import.meta?.env?.VITE_API_URL;
    if (envUrl) return envUrl;

    // 2) Derive from the current browser origin when available
    if (typeof window !== 'undefined') {
        const { origin } = window.location;

        // Local dev case: any port for frontend, backend usually on :8000
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            // Extract base (http://localhost or http://127.0.0.1) and append :8000
            const baseUrl = origin.split(':').slice(0, 2).join(':');
            return `${baseUrl}:8000`;
        }

        // Otherwise, assume backend is on the same origin
        return origin;
    }

    // 3) Safe fallback for non-browser environments
    return 'http://127.0.0.1:8000';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
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
