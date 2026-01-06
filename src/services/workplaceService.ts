import apiClient from '../utils/apiClient';

interface Coordinate {
    latitude: number;
    longitude: number;
}

// 매니저 계정 - 관리중인 업장의 점주/매니저 목록 조회
export const getWorkplaceManagers = async (workspaceId: string | number): Promise<unknown> => {
    if (!workspaceId) {
        throw new Error('업장 ID가 필요합니다.');
    }

    try {
        const response = await apiClient.get(
            `/manager/workspaces/${workspaceId}/managers`,
            {
                params: { pageSize: 10 },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            '매니저 계정 - 점주/매니저 조회 오류:',
            error
        );

        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
            throw new Error(
                '인증이 만료되었습니다. 다시 로그인해주세요.'
            );
        } else if (axiosError.response?.status === 403) {
            throw new Error(
                '해당 업장에 대한 접근 권한이 없습니다.'
            );
        } else if (axiosError.response?.status === 404) {
            throw new Error('업장을 찾을 수 없습니다.');
        }

        throw error;
    }
};

// 매니저 계정 - 관리중인 업장의 알바생 목록 조회
export const getWorkplaceWorkers = async (workspaceId: string | number): Promise<unknown> => {
    if (!workspaceId) {
        throw new Error('업장 ID가 필요합니다.');
    }

    try {
        const response = await apiClient.get(
            `/manager/workspaces/${workspaceId}/workers`,
            {
                params: { pageSize: 10 },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            '매니저 계정 - 알바생 조회 오류:',
            error
        );

        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
            throw new Error(
                '인증이 만료되었습니다. 다시 로그인해주세요.'
            );
        } else if (axiosError.response?.status === 403) {
            throw new Error(
                '해당 업장에 대한 접근 권한이 없습니다.'
            );
        } else if (axiosError.response?.status === 404) {
            throw new Error('업장을 찾을 수 없습니다.');
        }

        throw error;
    }
};

// 근무자 조회 로직 (기존 함수 유지 - 호환성)
export const getWorkplaceEmployee = async (workspaceId: string | number): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/manager/workspaces/${workspaceId}/workers`,
            {
                params: {
                    page: 1,
                    pageSize: 5,
                    status: 'ACTIVATED',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('근무자 조회 오류:', error);
        throw new Error(
            '근무자 조회 중 오류가 발생했습니다.'
        );
    }
};

// 업장 상세 정보 조회 로직
export const getWorkplaceDetailInfo = async (
    workspaceId: string | number
): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/manager/workspaces/${workspaceId}`
        );

        return response.data;
    } catch (error) {
        console.error('업장 상세 정보 조회 오류:', error);
        throw new Error(
            '업장 상세 정보 조회 중 오류가 발생했습니다.'
        );
    }
};

// 지도 마커 조회 로직
export const getMapMarkers = async (
    coordinate1: Coordinate,
    coordinate2: Coordinate
): Promise<unknown> => {
    try {
        const response = await apiClient.get('/app/postings/map/markers', {
            params: {
                'coordinate1.latitude': coordinate1.latitude,
                'coordinate1.longitude': coordinate1.longitude,
                'coordinate2.latitude': coordinate2.latitude,
                'coordinate2.longitude': coordinate2.longitude,
            },
        });

        return response.data;
    } catch (error) {
        console.error('지도 마커 조회 오류:', error);
        throw new Error(
            '지도 마커 조회 중 오류가 발생했습니다.'
        );
    }
};

// 매니저 계정 - 관리중인 업장의 스케줄 조회
export const getWorkplaceSchedule = async (
    workspaceId: string | number,
    year: number,
    month: number
): Promise<unknown> => {
    if (!workspaceId) {
        throw new Error('업장 ID가 필요합니다.');
    }

    try {
        const response = await apiClient.get('/manager/schedules', {
            params: {
                workspaceId,
                year,
                month,
            },
        });

        return response.data;
    } catch (error) {
        console.error(
            '매니저 계정 - 업장 스케줄 조회 오류:',
            error
        );

        const axiosError = error as { response?: { status?: number }; message?: string };
        if (axiosError.response?.status === 401) {
            throw new Error(
                '인증이 만료되었습니다. 다시 로그인해주세요.'
            );
        } else if (axiosError.response?.status === 403) {
            throw new Error(
                '해당 업장에 대한 접근 권한이 없습니다.'
            );
        } else if (axiosError.response?.status === 404) {
            throw new Error('업장을 찾을 수 없습니다.');
        }

        throw new Error(
            `업장 스케줄 조회 중 오류가 발생했습니다: ${axiosError.message || '알 수 없는 오류'}`
        );
    }
};

interface GetMapJobPostingsParams {
    cursorInfo?: string;
    pageSize?: number;
    searchKeyword?: string;
    sortType?: string;
}

// 지도 공고 리스트 조회 로직 (커서 페이징)
export const getMapJobPostings = async (
    coordinate1: Coordinate,
    coordinate2: Coordinate,
    {
        cursorInfo = '',
        pageSize = 10,
        searchKeyword = '',
        sortType = 'LATEST',
    }: GetMapJobPostingsParams = {}
): Promise<unknown> => {
    try {
        const params: Record<string, string | number> = {
            'coordinate1.latitude': coordinate1.latitude,
            'coordinate1.longitude': coordinate1.longitude,
            'coordinate2.latitude': coordinate2.latitude,
            'coordinate2.longitude': coordinate2.longitude,
            pageSize,
            sortType,
        };

        if (cursorInfo) {
            params.cursor = cursorInfo;
        }

        if (searchKeyword) {
            params.searchKeyword = searchKeyword;
        }

        const response = await apiClient.get('/app/postings/map', {
            params,
        });

        return response.data;
    } catch (error) {
        console.error('지도 공고 리스트 조회 오류:', error);
        throw new Error(
            '지도 공고 리스트 조회 중 오류가 발생했습니다.'
        );
    }
};

// 특정 업장의 공고 목록 조회 로직
export const getWorkspacePostings = async (workspaceId: string | number): Promise<unknown> => {
    try {
        const response = await apiClient.get(
            `/app/postings/workspaces/${workspaceId}`
        );

        return response.data;
    } catch (error) {
        console.error('업장 공고 목록 조회 오류:', error);
        throw new Error(
            '업장 공고 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

