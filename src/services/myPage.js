import useAuthStore from '../store/authStore';

const accessToken = useAuthStore.getState().accessToken;
const backend = import.meta.env.VITE_API_URL;

// 공고 스크랩 리스트 목록 조회 로직
export const getScrapPostList = async ({ cursorInfo }) => {
    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/favorites?cursor=${cursorInfo}&pageSize=10`,
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
            '공고 스크랩 리스트 목록 조회 오류:',
            error
        );
        throw new Error(
            '공고 스크랩 리스트 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 목록 조회 로직
export const getApplicationList = async ({
    page = 1,
    pageSize = 10,
}) => {
    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/applications?page=${page}&pageSize=${pageSize}`,
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

// 공고 지원 취소 로직
export const cancelApplication = async ({
    applicationId,
}) => {
    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/applications/${applicationId}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    status: 'CANCELLED',
                }),
            }
        );
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('공고 지원 취소 중 오류:', error);
        throw new Error(
            '공고 지원 취소 중 오류가 발생했습니다.'
        );
    }
};
