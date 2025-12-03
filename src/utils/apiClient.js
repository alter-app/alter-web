import axios from 'axios';
import useAuthStore from '../store/authStore';
import { refreshAccessToken } from '../services/refreshToken';

const backend = import.meta.env.VITE_API_URL;

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: backend,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 interceptor: 모든 요청에 accessToken 추가
apiClient.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 interceptor: 401 에러 시 자동으로 refresh token 요청
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, refresh 요청이 아닌 경우에만 처리
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/token')
        ) {
            if (isRefreshing) {
                // 이미 refresh 중이면 대기
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { accessToken } =
                    await refreshAccessToken();
                processQueue(null, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // 토큰 만료 모달 표시
                useAuthStore
                    .getState()
                    .openTokenExpiredModal();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
