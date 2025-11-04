import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 공고 리스트 조회 로직
export const getPostList = async ({ cursorInfo }) => {
    const accessToken = useAuthStore.getState().accessToken;
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
    const accessToken = useAuthStore.getState().accessToken;
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

// 공고 등록 로직
export const postJobPosting = async (inputs) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/postings`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(inputs),
            }
        );
        console.log(inputs);
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('공고 작성 중 오류:', error);
        throw new Error(
            '공고 작성 중 오류가 발생했습니다.'
        );
    }
};

// 공고 키워드 리스트 조회 로직
export const getAvailableKeywords = async () => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/postings/available-keywords`,
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
        console.error('공고 키워드 조회 오류:', error);
        throw new Error(
            '공고 키워드 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 로직
export const postingApply = async ({
    postingId,
    description,
    postingScheduleId,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/postings/apply/${postingId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    postingScheduleId,
                    description,
                }),
            }
        );
        console.log(postingScheduleId, description);
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('공고 지원 중 오류:', error);
        throw new Error(
            '공고 지원 중 오류가 발생했습니다.'
        );
    }
};

// 공고 스크랩 등록 로직
export const addPostingScrap = async ({ postingId }) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/favorites/${postingId}`,
            {
                method: 'POST',
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
        console.error('공고 스크랩 등록 중 오류:', error);
        throw new Error(
            '공고 스크랩 등록 중 오류가 발생했습니다.'
        );
    }
};

// 공고 스크랩 삭제 로직
export const deletePostingScrap = async ({
    favoritePostingId,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/favorites/${favoritePostingId}`,
            {
                method: 'DELETE',
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
        console.error('공고 스크랩 삭제 중 오류:', error);
        throw new Error(
            '공고 스크랩 삭제 중 오류가 발생했습니다.'
        );
    }
};

// 공고 스크랩 목록 조회 로직
export const getPostingScrapList = async ({
    cursorInfo,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
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
        console.error('공고 리스트 조회 오류:', error);
        throw new Error(
            '공고 리스트 조회 중 오류가 발생했습니다.'
        );
    }
};
