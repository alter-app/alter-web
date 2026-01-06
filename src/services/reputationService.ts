import apiClient from '../utils/apiClient';

// 사용자 평판 키워드 조회 (APP scope)
export const getUserReputationKeywords = async (): Promise<unknown> => {
    try {
        const response = await apiClient.get('/app/reputations/keywords', {
            params: { keywordType: 'REPU_TO_WORK' },
        });

        return response.data;
    } catch (error) {
        console.error('사용자 평판 키워드 조회 오류:', error);
        throw new Error('사용자 평판 키워드 조회 중 오류가 발생했습니다.');
    }
};

// 매니저 평판 키워드 조회 (MANAGER scope)
export const getManagerReputationKeywords = async (): Promise<unknown> => {
    try {
        const response = await apiClient.get('/manager/reputations/keywords', {
            params: { keywordType: 'REPU_TO_USER' },
        });

        return response.data;
    } catch (error) {
        console.error('매니저 평판 키워드 조회 오류:', error);
        throw new Error('매니저 평판 키워드 조회 중 오류가 발생했습니다.');
    }
};

// 평판 수락 및 작성 로직
export const submitReputation = async (
    requestId: string | number,
    keywordsPayload: unknown
): Promise<void> => {
    try {
        await apiClient.post(
            `/manager/reputations/requests/${requestId}/accept`,
            {
                keywords: keywordsPayload,
            }
        );
    } catch (error) {
        console.error('평판 수락 및 작성 중 오류:', error);
        throw new Error('평판 수락 및 작성 중 오류가 발생했습니다.');
    }
};

// 평판 요청 거절 로직
export const declineReputation = async (
    requestId: string | number
): Promise<void> => {
    try {
        await apiClient.patch(
            `/manager/reputations/requests/${requestId}/decline`
        );
    } catch (error) {
        console.error('평판 요청 거절 중 오류:', error);
        throw new Error('평판 요청 거절 중 오류가 발생했습니다.');
    }
};

