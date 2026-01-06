import apiClient from '../utils/apiClient';

/**
 * Owner 대타 요청 목록 조회
 * @param pageSize - 페이지 크기
 * @param cursor - 커서
 * @param status - 요청 상태 (PENDING, ACCEPTED, REJECTED_BY_TARGET, APPROVED, REJECTED_BY_APPROVER, CANCELLED, EXPIRED)
 * @returns API 응답
 */
export const getOwnerSubstituteRequests = async (
    pageSize: number = 10,
    cursor: string | null = null,
    status: string | null = null
): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = { pageSize };
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
 * @param requestId - 대타 요청 ID
 * @param approvalComment - 승인 코멘트
 * @returns API 응답
 */
export const approveOwnerSubstituteRequest = async (
    requestId: string | number,
    approvalComment: string = '승인합니다'
): Promise<unknown> => {
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
 * @param requestId - 대타 요청 ID
 * @param approverRejectionReason - 승인자 거절 사유
 * @returns API 응답
 */
export const rejectOwnerSubstituteRequest = async (
    requestId: string | number,
    approverRejectionReason: string = '승인 불가'
): Promise<unknown> => {
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

