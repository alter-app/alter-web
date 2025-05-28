import useAuthStore from '../store/authStore';

const accessToken = useAuthStore.getState().accessToken;
const backend = import.meta.env.VITE_API_URL;

// 공고 리스트 조회 로직
export const getPostList = async ({ cursorInfo }) => {
    try {
        const response = await fetch(
            `${backend}/app/postings?cursor=${cursorInfo}&pageSize=10`,
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
        console.error('공고 리스트 조회 오류:', error);
        throw new Error(
            '공고 리스트 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 상세 조회 로직
export const getPostDetail = async (id) => {
    try {
        const response = await fetch(
            `${backend}/app/postings/${id}`,
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
        console.error('공고 상세 조회 오류:', error);
        throw new Error(
            '공고 상세 조회 중 오류가 발생했습니다.'
        );
    }
};
