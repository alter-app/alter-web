import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 근무자 조회 로직
export const getWorkplaceEmployee = async (workspaceId) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/workspaces/${workspaceId}/workers?page=1&pageSize=5&status=ACTIVATED`,
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
        console.error('근무자 조회 오류:', error);
        throw new Error(
            '근무자 조회 중 오류가 발생했습니다.'
        );
    }
};

// 업장 상세 정보 조회 로직
export const getWorkplaceDetailInfo = async (
    workspaceId
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/workspaces/${workspaceId}`,
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
        console.error('업장 상세 정보 조회 오류:', error);
        throw new Error(
            '업장 상세 정보 조회 중 오류가 발생했습니다.'
        );
    }
};
