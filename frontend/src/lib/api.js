import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://calmprep-ai.onrender.com';

// Create a dedicated axios instance with proper defaults
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30s timeout for Render cold starts
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach auth token automatically
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

// Response interceptor: translate network errors into user-friendly messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error (no response from server)
            // This is the "Failed to fetch" scenario
            error.message =
                'Unable to connect to the server. It may be starting up — please try again in a few seconds.';
        }
        return Promise.reject(error);
    }
);

export default api;
