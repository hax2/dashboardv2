import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Vercel will rewrite this to the backend
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;