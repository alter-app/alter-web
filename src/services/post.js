import apiClient from '../utils/apiClient';

// 공고 리스트 조회 로직
export const getPostList = async ({
    cursorInfo = '',
    search = '',
    province = '',
    district = '',
    town = '',
    minPayAmount = '',
    maxPayAmount = '',
    startTime = '',
    endTime = '',
}) => {
    try {
        const params = {
            cursor: cursorInfo,
            pageSize: 10,
        };

        if (search) {
            params.search = search;
        }

        if (province) {
            params.province = province;
        }

        if (district) {
            params.district = district;
        }

        if (town) {
            params.town = town;
        }

        if (minPayAmount) {
            params.minPayAmount = minPayAmount;
        }

        if (maxPayAmount) {
            params.maxPayAmount = maxPayAmount;
        }

        if (startTime) {
            params.startTime = startTime;
        }

        if (endTime) {
            params.endTime = endTime;
        }

        const response = await apiClient.get(
            '/app/postings',
            {
                params,
            }
        );

        return response.data;
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
        const response = await apiClient.get(
            `/app/postings/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('공고 상세 조회 오류:', error);
        throw new Error(
            '공고 상세 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 등록 로직
export const postJobPosting = async (inputs) => {
    try {
        const response = await apiClient.post(
            '/manager/postings',
            inputs
        );
        return response.data;
    } catch (error) {
        console.error('공고 작성 중 오류:', error);
        throw new Error(
            '공고 작성 중 오류가 발생했습니다.'
        );
    }
};

// 공고 키워드 리스트 조회 로직
export const getAvailableKeywords = async () => {
    try {
        const response = await apiClient.get(
            '/manager/postings/available-keywords'
        );
        return response.data;
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
    try {
        const response = await apiClient.post(
            `/app/postings/apply/${postingId}`,
            {
                postingScheduleId,
                description,
            }
        );

        return response.data;
    } catch (error) {
        console.error('공고 지원 중 오류:', error);
        throw new Error(
            '공고 지원 중 오류가 발생했습니다.'
        );
    }
};

// 공고 스크랩 등록 로직
export const addPostingScrap = async ({ postingId }) => {
    try {
        const response = await apiClient.post(
            `/app/users/me/postings/favorites/${postingId}`
        );

        return response.data;
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
    try {
        const response = await apiClient.delete(
            `/app/users/me/postings/favorites/${favoritePostingId}`
        );

        return response.data;
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
    try {
        const response = await apiClient.get(
            '/app/users/me/postings/favorites',
            {
                params: {
                    cursor: cursorInfo,
                    pageSize: 10,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('공고 리스트 조회 오류:', error);
        throw new Error(
            '공고 리스트 조회 중 오류가 발생했습니다.'
        );
    }
};
