import apiClient from '../utils/apiClient';

/**
 * 교환 가능한 스케줄 조회
 * @param {number} workspaceId - 업장 ID
 * @param {number} year - 조회할 연도
 * @param {number} month - 조회할 월
 * @returns {Promise} API 응답
 */
export const getExchangeableSchedules = async (
    workspaceId,
    year,
    month
) => {
    try {
        const response = await apiClient.get(
            `/app/workspaces/${workspaceId}/exchangeable-schedules`,
            {
                params: {
                    year,
                    month,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            '교환 가능한 스케줄 조회 실패:',
            error
        );
        throw error;
    }
};

/**
 * 보낸 대타 요청 목록 조회
 * @param {number} pageSize - 페이지 크기
 * @param {string} cursor - 커서
 * @param {string} status - 요청 상태 (PENDING, ACCEPTED, REJECTED_BY_TARGET, APPROVED, REJECTED_BY_APPROVER, CANCELLED, EXPIRED)
 * @returns {Promise} API 응답
 */
export const getSentSubstituteRequests = async (
    pageSize = 10,
    cursor = null,
    status = null
) => {
    try {
        const params = { pageSize };
        if (cursor) {
            params.cursor = cursor;
        }
        if (status) {
            params.status = status;
        }

        const response = await apiClient.get(
            '/app/users/me/substitute-requests/sent',
            { params }
        );
        return response.data;
    } catch (error) {
        console.error(
            '보낸 대타 요청 목록 조회 실패:',
            error
        );
        throw error;
    }
};

/**
 * 대타 요청 생성
 * @param {number} scheduleId - 스케줄 ID
 * @param {Object} data - 요청 데이터
 * @param {string} data.requestType - 요청 타입 (예: "ALL")
 * @param {number} data.targetId - 대상 ID (대타를 요청할 상대방)
 * @param {string} data.requestReason - 요청 사유
 * @returns {Promise} API 응답
 */
export const createSubstituteRequest = async (
    scheduleId,
    data
) => {
    try {
        const response = await apiClient.post(
            `/app/schedules/${scheduleId}/substitute-requests`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('대타 요청 생성 실패:', error);
        throw error;
    }
};

/**
 * 보낸 대타 요청 취소
 * @param {number} requestId - 대타 요청 ID
 * @returns {Promise} API 응답
 */
export const cancelSubstituteRequest = async (
    requestId
) => {
    try {
        const response = await apiClient.delete(
            `/app/users/me/substitute-requests/${requestId}`
        );
        return response.data;
    } catch (error) {
        console.error('대타 요청 취소 실패:', error);
        throw error;
    }
};

/**
 * 받은 대타 요청 목록 조회
 * @param {number} pageSize - 페이지 크기
 * @param {string} cursor - 커서
 * @param {string} status - 요청 상태 (PENDING, ACCEPTED, REJECTED_BY_TARGET, APPROVED, REJECTED_BY_APPROVER, CANCELLED, EXPIRED)
 * @returns {Promise} API 응답
 */
export const getReceivedSubstituteRequests = async (
    pageSize = 10,
    cursor = null,
    status = null
) => {
    try {
        const params = { pageSize };
        if (cursor) {
            params.cursor = cursor;
        }
        if (status) {
            params.status = status;
        }

        const response = await apiClient.get(
            '/app/users/me/substitute-requests/received',
            { params }
        );
        return response.data;
    } catch (error) {
        console.error(
            '받은 대타 요청 목록 조회 실패:',
            error
        );
        throw error;
    }
};

/**
 * 받은 대타 요청 수락
 * @param {number} requestId - 대타 요청 ID
 * @returns {Promise} API 응답
 */
export const acceptSubstituteRequest = async (
    requestId
) => {
    try {
        const response = await apiClient.post(
            `/app/substitute-requests/${requestId}/accept`,
            {}
        );
        return response.data;
    } catch (error) {
        console.error('대타 요청 수락 실패:', error);
        throw error;
    }
};

/**
 * 받은 대타 요청 거절
 * @param {number} requestId - 대타 요청 ID
 * @param {string} rejectionReason - 거절 사유
 * @returns {Promise} API 응답
 */
export const rejectSubstituteRequest = async (
    requestId,
    rejectionReason = '개인 사정으로 인한 거절'
) => {
    try {
        const response = await apiClient.post(
            `/app/substitute-requests/${requestId}/reject`,
            {
                targetRejectionReason: rejectionReason,
            }
        );
        return response.data;
    } catch (error) {
        console.error('대타 요청 거절 실패:', error);
        throw error;
    }
};
