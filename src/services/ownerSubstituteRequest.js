import axios from 'axios';
import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

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
    const accessToken = useAuthStore.getState().accessToken;
    try {
        let url = `${backend}/manager/substitute-requests?pageSize=${pageSize}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }
        if (status) {
            url += `&status=${status}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
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
 * Owner 대타 요청 수락
 * @param {number} requestId - 대타 요청 ID
 * @returns {Promise} API 응답
 */
export const acceptOwnerSubstituteRequest = async (
    requestId
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await axios.post(
            `${backend}/manager/substitute-requests/${requestId}/accept`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Owner 대타 요청 수락 실패:', error);
        throw error;
    }
};

/**
 * Owner 대타 요청 거절
 * @param {number} requestId - 대타 요청 ID
 * @param {string} rejectionReason - 거절 사유
 * @returns {Promise} API 응답
 */
export const rejectOwnerSubstituteRequest = async (
    requestId,
    rejectionReason = '승인 불가'
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await axios.post(
            `${backend}/manager/substitute-requests/${requestId}/reject`,
            {
                approverRejectionReason: rejectionReason,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Owner 대타 요청 거절 실패:', error);
        throw error;
    }
};
