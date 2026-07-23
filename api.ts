import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error)
});

api.interceptors.response.use(
    (response) => response,
    (error => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken')
            }
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }))