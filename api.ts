import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface AxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface FailedRequest {
    resolve: (value?: unknown) => void
    reject: (value?: unknown) => void
}



export const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else {
            resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig | undefined

        if (!originalRequest) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            const url = originalRequest.url || '';
            if (
                url.includes('/auth/refresh') || 
                url.includes('/auth/login') || 
                url.includes('/auth/register')
            ) {
                if (url.includes('/auth/refresh')) {
                    window.location.href = '/login';
                    console.error("INTERCEPTOR CAUGHT REFRESH ERROR!", error);
                }
                return Promise.reject(error);
            }
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    return api(originalRequest)
                }).catch(err => {
                    return Promise.reject(err)
                })
            }

            isRefreshing = true;

            try {
                await api.post('/auth/refresh')
                processQueue(null)
                return api(originalRequest)
            }
            catch (refreshError) {
                processQueue(refreshError as AxiosError, null)
                window.location.href = '/login'
                console.error("INTERCEPTOR CAUGHT REFRESH ERROR!", refreshError);
                return Promise.reject(refreshError)
            }
            finally {
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    }
)