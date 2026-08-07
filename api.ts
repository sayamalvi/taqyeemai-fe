import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === '/auth/refresh') {
                window.location.href = '/login'
                return Promise.reject()
            }
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh')
                return api(originalRequest
                )
            }
            catch (refreshError) {
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)