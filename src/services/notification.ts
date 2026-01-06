import apiClient from '../utils/apiClient';

/**
 * 알림 목록 조회 (사용자용)
 * @param pageSize - 페이지 크기
 * @param cursor - 커서
 * @returns API 응답
 */
export const getNotifications = async (
    pageSize: number = 10,
    cursor: string | null = null
): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = { pageSize };
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
 * @param pageSize - 페이지 크기
 * @param cursor - 커서
 * @returns API 응답
 */
export const getManagerNotifications = async (
    pageSize: number = 10,
    cursor: string | null = null
): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = { pageSize };
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

