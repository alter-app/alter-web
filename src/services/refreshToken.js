import axios from 'axios';
import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 토큰 재발급 함수
// 주의: 이 함수는 apiClient를 사용하지 않고 직접 axios 사용 (무한 루프 방지)
export const refreshAccessToken = async () => {
    const { refreshToken, scope } = useAuthStore.getState();

    if (!refreshToken) {
        throw new Error('RefreshToken이 없습니다.');
    }

    const basePath =
        scope === 'MANAGER' ? 'manager' : 'app';

    try {
        // apiClient를 사용하지 않고 직접 axios 사용 (interceptor 우회)
        const response = await axios.post(
            `${backend}/${basePath}/auth/token`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );

        const {
            accessToken,
            refreshToken: newRefreshToken,
            authorizationId,
            scope: newScope,
        } = response.data.data;

        useAuthStore.getState().setAuth({
            accessToken,
            refreshToken: newRefreshToken,
            authorizationId,
            scope: newScope,
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        // logout은 apiClient에서 모달 확인 후 처리하도록 함
        throw error;
    }
};

