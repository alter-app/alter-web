import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 스케줄 생성 로직
export const createSchedule = async ({
    workspaceId,
    startDateTime,
    endDateTime,
    position,
}) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/manager/schedules`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    workspaceId,
                    startDateTime,
                    endDateTime,
                    position,
                }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('스케줄 생성 오류:', error);
        throw new Error(
            '스케줄 생성 중 오류가 발생했습니다.'
        );
    }
};
