import axios from 'axios';
import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

/**
 * 교환 가능한 스케줄 조회
 * @param {number} workspaceId - 업장 ID
 * @param {number} year - 조회할 연도
 * @param {number} month - 조회할 월
 * @returns {Promise} API 응답
 */
export const getExchangeableSchedules = async (
    workspaceId,
    year,
    month
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await axios.get(
            `${backend}/app/workspaces/${workspaceId}/exchangeable-schedules`,
            {
                params: {
                    year,
                    month,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            '교환 가능한 스케줄 조회 실패:',
            error
        );
        throw error;
    }
};

/**
 * 대타 요청 생성
 * @param {number} scheduleId - 스케줄 ID
 * @param {Object} data - 요청 데이터
 * @param {string} data.requestType - 요청 타입 (예: "ALL")
 * @param {number} data.targetId - 대상 ID (대타를 요청할 상대방)
 * @param {string} data.requestReason - 요청 사유
 * @returns {Promise} API 응답
 */
export const createSubstituteRequest = async (
    scheduleId,
    data
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await axios.post(
            `${backend}/app/schedules/${scheduleId}/substitute-requests`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('대타 요청 생성 실패:', error);
        throw error;
    }
};
