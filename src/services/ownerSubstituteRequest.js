import apiClient from '../utils/apiClient';

/**
 * Owner 대타 요청 목록 조회
 * @param {number} pageSize - 페이지 크기
 * @param {string} cursor - 커서
 * @param {string} status - 요청 상태 (PENDING, ACCEPTED, REJECTED_BY_TARGET, APPROVED, REJECTED_BY_APPROVER, CANCELLED, EXPIRED)
 * @returns {Promise} API 응답
 */
export const getOwnerSubstituteRequests = async (
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
            '/manager/substitute-requests',
            { params }
        );
        return response.data;
    } catch (error) {
        console.error(
            'Owner 대타 요청 목록 조회 실패:',
            error
        );
        throw error;
    }
};

/**
 * Owner 대타 요청 승인
 * @param {number} requestId - 대타 요청 ID
 * @param {string} approvalComment - 승인 코멘트
 * @returns {Promise} API 응답
 */
export const approveOwnerSubstituteRequest = async (
    requestId,
    approvalComment = '승인합니다'
) => {
    try {
        const response = await apiClient.post(
            `/manager/substitute-requests/${requestId}/approve`,
            {
                approvalComment: approvalComment,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Owner 대타 요청 승인 실패:', error);
        throw error;
    }
};

/**
 * Owner 대타 요청 거절
 * @param {number} requestId - 대타 요청 ID
 * @param {string} approverRejectionReason - 승인자 거절 사유
 * @returns {Promise} API 응답
 */
export const rejectOwnerSubstituteRequest = async (
    requestId,
    approverRejectionReason = '승인 불가'
) => {
    try {
        const response = await apiClient.post(
            `/manager/substitute-requests/${requestId}/reject`,
            {
                approverRejectionReason:
                    approverRejectionReason,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Owner 대타 요청 거절 실패:', error);
        throw error;
    }
};
