import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 매니저 정보 조회 로직
export const getManagerInfo = async () => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/me`,
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
        console.error('매니저 정보 조회 오류:', error);
        throw new Error(
            '매니저 정보 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 목록 조회 로직
export const getPostingsApplications = async ({
    cursorInfo,
    checkedWorkplaceId,
    checkedStatusId,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/postings/applications?cursor=${cursorInfo}&pageSize=10&workspaceId=${checkedWorkplaceId}&status=${checkedStatusId}`,
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
        console.error('공고 지원 목록 조회 오류:', error);
        throw new Error(
            '공고 지원 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 상세 조회 로직
export const getPostingsApplicationDetail = async (
    postingApplicationId
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/postings/applications/${postingApplicationId}`,
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
        console.error('공고 지원 상세 조회 오류:', error);
        throw new Error(
            '공고 지원 상세 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 상태 변경 로직
export const updateApplicationStatus = async ({
    postingApplicationId,
    status,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/postings/applications/${postingApplicationId}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    status,
                }),
            }
        );
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
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

// 보낸 평판 요청 목록 조회
export const getSentReputationRequests = async ({
    cursorInfo,
    status,
    pageSize = 10,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const statusParam =
            status && status.length > 0 ? status[0] : '';
        const response = await fetch(
            `${backend}/manager/reputations/requests/sent?cursor=${cursorInfo}&pageSize=${pageSize}&status=${statusParam}`,
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
    requestId
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/reputations/requests/sent/${requestId}/cancel`,
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

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('평판 요청 취소 오류:', error);
        throw new Error(
            '평판 요청 취소 중 오류가 발생했습니다.'
        );
    }
};

// 받은 평판 요청 목록 조회
export const getManagerReputationRequests = async ({
    cursorInfo,
    pageSize = 10,
    status = [],
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        // status 배열을 쿼리 파라미터로 변환
        const statusParam =
            status.length > 0
                ? `&status=${status.join(',')}`
                : '';

        const response = await fetch(
            `${backend}/manager/reputations/requests?cursor=${cursorInfo}&pageSize=${pageSize}${statusParam}`,
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
            '받은 평판 요청 목록 조회 오류:',
            error
        );
        throw new Error(
            '받은 평판 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 근무자에게 평판 생성
export const createWorkerReputationByManager = async ({
    workspaceId,
    targetUserId,
    keywordsPayload,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/reputations/requests/users`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    workspaceId: workspaceId,
                    requestType: 'WORKSPACE_TO_USER',
                    targetUserId: targetUserId,
                    keywords: keywordsPayload,
                }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('근무자 평판 생성 오류:', error);
        throw new Error(
            '근무자 평판 생성 중 오류가 발생했습니다.'
        );
    }
};
