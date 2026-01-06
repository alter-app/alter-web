import apiClient from '../utils/apiClient';

interface CreateScheduleParams {
    workspaceId: string | number;
    startDateTime: string;
    endDateTime: string;
    position: string;
}

interface AssignWorkerParams {
    workShiftId: string | number;
    workerId: string | number;
}

// 스케줄 생성 로직
export const createSchedule = async ({
    workspaceId,
    startDateTime,
    endDateTime,
    position,
}: CreateScheduleParams): Promise<unknown> => {
    try {
        const response = await apiClient.post('/manager/schedules', {
            workspaceId,
            startDateTime,
            endDateTime,
            position,
        });

        return response.data;
    } catch (error) {
        console.error('스케줄 생성 오류:', error);
        throw new Error(
            '스케줄 생성 중 오류가 발생했습니다.'
        );
    }
};

// 근무자 배정 로직
export const assignWorker = async ({
    workShiftId,
    workerId,
}: AssignWorkerParams): Promise<unknown> => {
    try {
        const response = await apiClient.post(
            `/manager/schedules/${workShiftId}/workers`,
            {
                workerId,
            }
        );

        return response.data;
    } catch (error) {
        console.error('근무자 배정 오류:', error);
        throw new Error(
            '근무자 배정 중 오류가 발생했습니다.'
        );
    }
};

// 근무자 변경 로직
export const updateWorker = async ({
    workShiftId,
    workerId,
}: AssignWorkerParams): Promise<unknown> => {
    try {
        const response = await apiClient.put(
            `/manager/schedules/${workShiftId}/workers`,
            {
                workerId,
            }
        );

        return response.data;
    } catch (error) {
        console.error('근무자 변경 오류:', error);
        throw new Error(
            '근무자 변경 중 오류가 발생했습니다.'
        );
    }
};

// 근무자 제거 로직
export const removeWorker = async ({ workShiftId }: { workShiftId: string | number }): Promise<unknown> => {
    try {
        const response = await apiClient.delete(
            `/manager/schedules/${workShiftId}/workers`
        );

        return response.data;
    } catch (error) {
        console.error('근무자 제거 오류:', error);
        throw new Error(
            '근무자 제거 중 오류가 발생했습니다.'
        );
    }
};

