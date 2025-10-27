import axios from 'axios';
import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

/**
 * 알림 목록 조회
 * @param {number} pageSize - 페이지 크기
 * @param {string} cursor - 커서
 * @returns {Promise} API 응답
 */
/**
 * 알림 목록 조회 (사용자용)
 * @param {number} pageSize - 페이지 크기
 * @param {string} cursor - 커서
 * @returns {Promise} API 응답
 */
export const getNotifications = async (
    pageSize = 10,
    cursor = null
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        let url = `${backend}/app/users/me/notifications?pageSize=${pageSize}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('알림 목록 조회 실패:', error);
        throw error;
    }
};

/**
 * 알림 목록 조회 (매니저용)
 * @param {number} pageSize - 페이지 크기
 * @param {string} cursor - 커서
 * @returns {Promise} API 응답
 */
export const getManagerNotifications = async (
    pageSize = 10,
    cursor = null
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        let url = `${backend}/manager/notifications/me?pageSize=${pageSize}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('매니저 알림 목록 조회 실패:', error);
        throw error;
    }
};
