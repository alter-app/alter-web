import apiClient from '../utils/apiClient';

// 사용자 평판 요청 목록 조회 로직 (커서 페이징 지원)
export const getUserReputationRequestsList = async (
    pageSize: number = 10,
    cursor: string | null = null,
    status: string = 'REQUESTED'
): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = { status, pageSize };
        if (cursor) {
            params.cursor = cursor;
        }

        const response = await apiClient.get('/app/reputations/requests', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('평판 요청 목록 조회 오류:', error);
        throw new Error('평판 요청 목록 조회 중 오류가 발생했습니다.');
    }
};

// 사용자용 평판 수락 및 작성 로직
export const userSubmitReputation = async (
    requestId: string | number,
    keywordsPayload: unknown
): Promise<void> => {
    try {
        await apiClient.post(
            `/app/reputations/requests/${requestId}/accept`,
            {
                keywords: keywordsPayload,
            }
        );
    } catch (error) {
        console.error('평판 수락 및 작성 중 오류:', error);
        throw new Error('평판 수락 및 작성 중 오류가 발생했습니다.');
    }
};

// 사용자용 평판 요청 거절 로직
export const userDeclineReputation = async (
    requestId: string | number
): Promise<void> => {
    try {
        await apiClient.patch(
            `/app/reputations/requests/${requestId}/decline`
        );
    } catch (error) {
        console.error('평판 요청 거절 중 오류:', error);
        throw new Error('평판 요청 거절 중 오류가 발생했습니다.');
    }
};

// 근무 중인 업장 목록 조회 로직
export const getUserWorkplaceList = async (pageSize?: number): Promise<unknown> => {
    try {
        const params: Record<string, number> = {};
        if (pageSize) {
            params.pageSize = pageSize;
        }
        const response = await apiClient.get('/app/users/me/workspaces', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('근무 중인 업장 목록 조회 오류:', error);
        throw new Error('근무 중인 업장 목록 조회 중 오류가 발생했습니다.');
    }
};

// 사용자 스케줄 조회 로직
export const getUserScheduleSelf = async (
    year: number | null = null,
    month: number | null = null
): Promise<unknown> => {
    try {
        const params: Record<string, number> = {};
        if (year && month) {
            params.year = year;
            params.month = month;
        }

        const response = await apiClient.get('/app/schedules/self', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('스케줄 조회 오류:', error);
        throw new Error('스케줄 조회 중 오류가 발생했습니다.');
    }
};

// 사용자 계정 - 근무중인 업장의 점주/매니저 목록 조회
export const getWorkplaceManagers = async (workplaceId: string | number): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/app/users/me/workspaces/${workplaceId}/managers`,
            {
                params: { pageSize: 10 },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('점주/매니저 조회 오류:', error);
        throw new Error(
            `점주/매니저 조회 중 오류가 발생했습니다: ${errorMessage}`
        );
    }
};

// 사용자 계정 - 근무중인 업장의 알바생 목록 조회
export const getWorkplaceWorkers = async (workplaceId: string | number): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/app/users/me/workspaces/${workplaceId}/workers`,
            {
                params: { pageSize: 10 },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('알바생 조회 오류:', error);
        throw new Error(`알바생 조회 중 오류가 발생했습니다: ${errorMessage}`);
    }
};

// 업장 근무자 목록 조회 로직 (기존 함수 유지)
export const getWorkplaceEmployees = async (
    workplaceId: string | number,
    pageSize: number = 10,
    cursor: string | null = null
): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = { pageSize };
        if (cursor) {
            params.cursor = cursor;
        }

        const response = await apiClient.get(
            `/app/users/me/workspaces/${workplaceId}/workers`,
            { params }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('근무자 목록 조회 오류:', error);
        throw new Error(
            `근무자 목록 조회 중 오류가 발생했습니다: ${errorMessage}`
        );
    }
};

// 업장별 스케줄 조회 로직
export const getWorkplaceSchedule = async (
    workspaceId: string | number,
    year: number,
    month: number
): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/app/schedules/workspaces/${workspaceId}`,
            {
                params: { year, month },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('업장 스케줄 조회 오류:', error);
        throw new Error(
            `업장 스케줄 조회 중 오류가 발생했습니다: ${errorMessage}`
        );
    }
};

// 사용자용 업장 평판 생성
export const createWorkerReputation = async (
    workspaceId: string | number,
    keywordsPayload: unknown
): Promise<void> => {
    try {
        await apiClient.post('/app/reputations/requests/workspaces', {
            workspaceId: workspaceId,
            keywords: keywordsPayload,
        });
    } catch (error) {
        console.error('평판 생성 중 오류:', error);
        throw new Error('평판 생성 중 오류가 발생했습니다.');
    }
};

// 사용자가 보낸 평판 요청 목록 조회 (커서 페이징 지원)
export const getUserSentReputationRequestsList = async (
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

        const response = await apiClient.get('/app/reputations/requests/sent', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('보낸 평판 요청 목록 조회 오류:', error);
        throw new Error('보낸 평판 요청 목록 조회 중 오류가 발생했습니다.');
    }
};

// 보낸 평판 요청 취소
export const cancelSentReputationRequest = async (
    requestId: string | number
): Promise<void> => {
    try {
        await apiClient.patch(
            `/app/reputations/requests/sent/${requestId}/cancel`
        );
    } catch (error) {
        console.error('보낸 평판 요청 취소 오류:', error);
        throw new Error('보낸 평판 요청 취소 중 오류가 발생했습니다.');
    }
};

// 지원 취소 API
export const cancelApplication = async (
    applicationId: string | number
): Promise<void> => {
    try {
        await apiClient.patch(
            `/app/users/me/postings/applications/${applicationId}/status`,
            {
                status: 'CANCELLED',
            }
        );
    } catch (error) {
        console.error('지원 취소 오류:', error);
        throw new Error('지원 취소 중 오류가 발생했습니다.');
    }
};

