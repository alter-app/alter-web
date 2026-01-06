import apiClient from '../utils/apiClient';

/**
 * 교환 가능한 스케줄 조회
 * @param workspaceId - 업장 ID
 * @param year - 조회할 연도
 * @param month - 조회할 월
 * @returns API 응답
 */
export const getExchangeableSchedules = async (
    workspaceId: string | number,
    year: number,
    month: number
): Promise<unknown> => {
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
 * @param pageSize - 페이지 크기
 * @param cursor - 커서
 * @param status - 요청 상태 (PENDING, ACCEPTED, REJECTED_BY_TARGET, APPROVED, REJECTED_BY_APPROVER, CANCELLED, EXPIRED)
 * @returns API 응답
 */
export const getSentSubstituteRequests = async (
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

interface CreateSubstituteRequestData {
    requestType: string;
    targetId: string | number;
    requestReason: string;
}

/**
 * 대타 요청 생성
 * @param scheduleId - 스케줄 ID
 * @param data - 요청 데이터
 * @returns API 응답
 */
export const createSubstituteRequest = async (
    scheduleId: string | number,
    data: CreateSubstituteRequestData
): Promise<unknown> => {
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
 * @param requestId - 대타 요청 ID
 * @returns API 응답
 */
export const cancelSubstituteRequest = async (
    requestId: string | number
): Promise<unknown> => {
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
 * @param pageSize - 페이지 크기
 * @param cursor - 커서
 * @param status - 요청 상태 (PENDING, ACCEPTED, REJECTED_BY_TARGET, APPROVED, REJECTED_BY_APPROVER, CANCELLED, EXPIRED)
 * @returns API 응답
 */
export const getReceivedSubstituteRequests = async (
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
 * @param requestId - 대타 요청 ID
 * @returns API 응답
 */
export const acceptSubstituteRequest = async (
    requestId: string | number
): Promise<unknown> => {
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
 * @param requestId - 대타 요청 ID
 * @param rejectionReason - 거절 사유
 * @returns API 응답
 */
export const rejectSubstituteRequest = async (
    requestId: string | number,
    rejectionReason: string = '개인 사정으로 인한 거절'
): Promise<unknown> => {
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

