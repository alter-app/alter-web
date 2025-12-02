import apiClient from '../utils/apiClient';

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
    try {
        const params = { pageSize };
        if (cursor) {
            params.cursor = cursor;
        }

        const response = await apiClient.get(
            '/app/users/me/notifications',
            { params }
        );
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
    try {
        const params = { pageSize };
        if (cursor) {
            params.cursor = cursor;
        }

        const response = await apiClient.get(
            '/manager/notifications/me',
            { params }
        );
        return response.data;
    } catch (error) {
        console.error('매니저 알림 목록 조회 실패:', error);
        throw error;
    }
};
