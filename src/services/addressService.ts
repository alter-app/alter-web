import apiClient from '../utils/apiClient';

// 행정구역 주소 조회 로직
export const getAddresses = async (code: string = ''): Promise<unknown> => {
    try {
        const params: Record<string, string> = {};
        if (code) {
            params.code = code;
        }

        const response = await apiClient.get('/app/addresses', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('행정구역 주소 조회 오류:', error);
        throw new Error(
            '행정구역 주소 조회 중 오류가 발생했습니다.'
        );
    }
};

