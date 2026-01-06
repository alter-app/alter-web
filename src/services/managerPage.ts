import apiClient from '../utils/apiClient';

// 매니저 정보 조회 로직
export const getManagerInfo = async (): Promise<unknown> => {
    try {
        const response = await apiClient.get('/manager/me');
        return response.data;
    } catch (error) {
        console.error('매니저 정보 조회 오류:', error);
        throw new Error(
            '매니저 정보 조회 중 오류가 발생했습니다.'
        );
    }
};

interface GetPostingsApplicationsParams {
    cursorInfo?: string | null;
    checkedWorkplaceId?: string | number | null;
    checkedStatusId?: string | null;
}

// 공고 지원 목록 조회 로직
export const getPostingsApplications = async ({
    cursorInfo,
    checkedWorkplaceId,
    checkedStatusId,
}: GetPostingsApplicationsParams): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = {
            pageSize: 10,
        };
        if (cursorInfo) {
            params.cursor = cursorInfo;
        }
        if (checkedWorkplaceId) {
            params.workspaceId = checkedWorkplaceId;
        }
        if (checkedStatusId) {
            params.status = checkedStatusId;
        }

        const response = await apiClient.get(
            '/manager/postings/applications',
            {
                params,
            }
        );

        return response.data;
    } catch (error) {
        console.error('공고 지원 목록 조회 오류:', error);
        throw new Error(
            '공고 지원 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 상세 조회 로직
export const getPostingsApplicationDetail = async (
    postingApplicationId: string | number
): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/manager/postings/applications/${postingApplicationId}`
        );

        return response.data;
    } catch (error) {
        console.error('공고 지원 상세 조회 오류:', error);
        throw new Error(
            '공고 지원 상세 조회 중 오류가 발생했습니다.'
        );
    }
};

interface UpdateApplicationStatusParams {
    postingApplicationId: string | number;
    status: string;
}

// 공고 지원 상태 변경 로직
export const updateApplicationStatus = async ({
    postingApplicationId,
    status,
}: UpdateApplicationStatusParams): Promise<unknown> => {
    try {
        const response = await apiClient.patch(
            `/manager/postings/applications/${postingApplicationId}/status`,
            { status }
        );

        return response.data;
    } catch (error) {
        console.error(
            '공고 지원 상태 변경 중 오류:',
            error
        );
        throw new Error(
            '공고 지원 상태 변경 중 오류가 발생했습니다.'
        );
    }
};

interface GetSentReputationRequestsParams {
    cursorInfo?: string | null;
    status?: string[];
    pageSize?: number;
}

// 보낸 평판 요청 목록 조회
export const getSentReputationRequests = async ({
    cursorInfo,
    status,
    pageSize = 10,
}: GetSentReputationRequestsParams): Promise<unknown> => {
    try {
        const statusParam =
            status && status.length > 0 ? status[0] : '';
        const response = await apiClient.get(
            '/manager/reputations/requests/sent',
            {
                params: {
                    cursor: cursorInfo,
                    pageSize,
                    status: statusParam,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            '보낸 평판 요청 목록 조회 오류:',
            error
        );
        throw new Error(
            '보낸 평판 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 보낸 평판 요청 취소
export const cancelReputationRequest = async (
    requestId: string | number
): Promise<unknown> => {
    try {
        const response = await apiClient.patch(
            `/manager/reputations/requests/sent/${requestId}/cancel`
        );

        return response.data;
    } catch (error) {
        console.error('평판 요청 취소 오류:', error);
        throw new Error(
            '평판 요청 취소 중 오류가 발생했습니다.'
        );
    }
};

interface GetManagerReputationRequestsParams {
    cursorInfo?: string | null;
    pageSize?: number;
    status?: string[];
}

// 받은 평판 요청 목록 조회
export const getManagerReputationRequests = async ({
    cursorInfo,
    pageSize = 10,
    status = [],
}: GetManagerReputationRequestsParams): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = {
            cursor: cursorInfo || '',
            pageSize,
        };
        if (status.length > 0) {
            params.status = status.join(',');
        }

        const response = await apiClient.get(
            '/manager/reputations/requests',
            { params }
        );

        return response.data;
    } catch (error) {
        console.error(
            '받은 평판 요청 목록 조회 오류:',
            error
        );
        throw new Error(
            '받은 평판 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

interface CreateWorkerReputationByManagerParams {
    workspaceId: string | number;
    targetUserId: string | number;
    keywordsPayload: unknown;
}

// 근무자에게 평판 생성
export const createWorkerReputationByManager = async ({
    workspaceId,
    targetUserId,
    keywordsPayload,
}: CreateWorkerReputationByManagerParams): Promise<unknown> => {
    try {
        const response = await apiClient.post(
            '/manager/reputations/requests/users',
            {
                workspaceId: workspaceId,
                requestType: 'WORKSPACE_TO_USER',
                targetUserId: targetUserId,
                keywords: keywordsPayload,
            }
        );

        return response.data;
    } catch (error) {
        console.error('근무자 평판 생성 오류:', error);
        throw new Error(
            '근무자 평판 생성 중 오류가 발생했습니다.'
        );
    }
};

