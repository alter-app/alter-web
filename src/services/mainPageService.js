import apiClient from '../utils/apiClient';

// 업장 목록 조회 로직
export const getWorkplaceList = async () => {
    try {
        const response = await apiClient.get('/manager/workspaces');
        return response.data;
    } catch (error) {
        console.error('업장 목록 조회 오류:', error);
        throw new Error(
            '업장 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 지원자 목록 조회 로직
export const getApplicants = async (
    pageSize = 5,
    status = null
) => {
    try {
        const params = { pageSize };
        if (status) {
            params.status = status;
        }

        const response = await apiClient.get('/manager/postings/applications', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('지원자 목록 조회 오류:', error);
        throw new Error(
            '지원자 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 평판 요청 목록 조회 로직
export const getReputationRequestList = async (
    pageSize = 5
) => {
    try {
        const response = await apiClient.get('/manager/reputations/requests', {
            params: { pageSize },
        });

        return response.data;
    } catch (error) {
        console.error('평판 요청 목록 조회 오류:', error);
        throw new Error(
            '평판 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};
