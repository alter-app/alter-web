import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 업장 목록 조회 로직
export const getWorkplaceList = async () => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/workspaces`,
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
        console.error('업장 목록 조회 오류:', error);
        throw new Error(
            '업장 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 지원자 목록 조회 로직
export const getApplicants = async () => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/postings/applications?pageSize=5`,
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
        console.error('지원자 목록 조회 오류:', error);
        throw new Error(
            '지원자 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 평판 요청 목록 조회 로직
export const getReputationRequestList = async () => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/reputations/requests?pageSize=5`,
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
        console.error('평판 요청 목록 조회 오류:', error);
        throw new Error(
            '평판 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};
