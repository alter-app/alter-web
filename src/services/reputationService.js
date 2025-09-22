import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 사용자 평판 키워드 조회 (APP scope)
export const getUserReputationKeywords = async () => {
    const { accessToken } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${backend}/app/reputations/keywords?keywordType=REPU_TO_WORK`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            '사용자 평판 키워드 조회 오류:',
            error
        );
        throw new Error(
            '사용자 평판 키워드 조회 중 오류가 발생했습니다.'
        );
    }
};

// 매니저 평판 키워드 조회 (MANAGER scope)
export const getManagerReputationKeywords = async () => {
    const { accessToken } = useAuthStore.getState();

    try {
        const response = await fetch(
            `${backend}/manager/reputations/keywords?keywordType=REPU_TO_USER`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            '매니저 평판 키워드 조회 오류:',
            error
        );
        throw new Error(
            '매니저 평판 키워드 조회 중 오류가 발생했습니다.'
        );
    }
};

// 평판 수락 및 작성 로직
export const submitReputation = async (
    requestId,
    keywordsPayload
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/manager/reputations/requests/${requestId}/accept`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    keywords: keywordsPayload,
                }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        console.error('평판 수락 및 작성 중 오류:', error);
        throw new Error(
            '평판 수락 및 작성 중 오류가 발생했습니다.'
        );
    }
};

// 평판 요청 거절 로직
export const declineReputation = async (requestId) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/manager/reputations/requests/${requestId}/decline`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        console.error('평판 요청 거절 중 오류:', error);
        throw new Error(
            '평판 요청 거절 중 오류가 발생했습니다.'
        );
    }
};
