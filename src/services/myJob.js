import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 사용자 평판 요청 목록 조회 로직
export const getUserReputationRequestsList = async (
    pageSize
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/reputations/requests?status=REQUESTED&pageSize=${pageSize}`,
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
        console.error('평판 요청 목록 조회 오류:', error);
        throw new Error(
            '평판 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 사용자용 평판 수락 및 작성 로직
export const userSubmitReputation = async (
    requestId,
    keywordsPayload
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/reputations/requests/${requestId}/accept`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    keywords: keywordsPayload,
                }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        console.error('평판 수락 및 작성 중 오류:', error);
        throw new Error(
            '평판 수락 및 작성 중 오류가 발생했습니다.'
        );
    }
};

// 사용자용 평판 요청 거절 로직
export const userDeclineReputation = async (requestId) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/reputations/requests/${requestId}/decline`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        console.error('평판 요청 거절 중 오류:', error);
        throw new Error(
            '평판 요청 거절 중 오류가 발생했습니다.'
        );
    }
};

// 근무 중인 업장 목록 조회 로직
export const getUserWorkplaceList = async (pageSize) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/users/me/workspaces?pageSize=${pageSize}`,
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
        console.error(
            '근무 중인 업장 목록 조회 오류:',
            error
        );
        throw new Error(
            '근무 중인 업장 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 사용자 스케줄 조회 로직
export const getUserScheduleSelf = async (
    year = null,
    month = null
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        let url = `${backend}/app/schedules/self`;
        if (year && month) {
            url += `?year=${year}&month=${month}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('스케줄 조회 오류:', error);
        throw new Error(
            '스케줄 조회 중 오류가 발생했습니다.'
        );
    }
};

// 사용자 계정 - 근무중인 업장의 점주/매니저 목록 조회
export const getWorkplaceManagers = async (workplaceId) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const url = `${backend}/app/users/me/workspaces/${workplaceId}/managers?pageSize=10`;

        console.log('점주/매니저 조회 API 요청:', {
            url,
            workplaceId,
            hasToken: !!accessToken,
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('점주/매니저 API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                '서버 응답 오류 상세:',
                errorText
            );
            throw new Error(
                `서버 응답 오류: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log('점주/매니저 API 응답 데이터:', data);
        return data;
    } catch (error) {
        console.error('점주/매니저 조회 오류:', error);
        throw new Error(
            `점주/매니저 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 사용자 계정 - 근무중인 업장의 알바생 목록 조회
export const getWorkplaceWorkers = async (workplaceId) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const url = `${backend}/app/users/me/workspaces/${workplaceId}/workers?pageSize=10`;

        console.log('알바생 조회 API 요청:', {
            url,
            workplaceId,
            hasToken: !!accessToken,
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('알바생 API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                '서버 응답 오류 상세:',
                errorText
            );
            throw new Error(
                `서버 응답 오류: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log('알바생 API 응답 데이터:', data);
        return data;
    } catch (error) {
        console.error('알바생 조회 오류:', error);
        throw new Error(
            `알바생 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 업장 근무자 목록 조회 로직 (기존 함수 유지)
export const getWorkplaceEmployees = async (
    workplaceId,
    pageSize = 10,
    cursor = null
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        let url = `${backend}/app/users/me/workspaces/${workplaceId}/workers?pageSize=${pageSize}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }

        console.log('근무자 조회 API 요청:', {
            url,
            workplaceId,
            pageSize,
            cursor,
            hasToken: !!accessToken,
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                '서버 응답 오류 상세:',
                errorText
            );
            throw new Error(
                `서버 응답 오류: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log('API 응답 데이터 구조:', {
            hasData: !!data,
            dataKeys: data ? Object.keys(data) : [],
            dataType: Array.isArray(data)
                ? 'array'
                : typeof data,
            dataLength: Array.isArray(data)
                ? data.length
                : 'N/A',
        });

        return data;
    } catch (error) {
        console.error('근무자 목록 조회 오류:', error);
        throw new Error(
            `근무자 목록 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 업장별 스케줄 조회 로직
export const getWorkplaceSchedule = async (
    workspaceId,
    year,
    month
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const url = `${backend}/app/schedules/workspace/${workspaceId}?year=${year}&month=${month}`;

        console.log('업장 스케줄 조회 API 요청:', {
            url,
            workspaceId,
            year,
            month,
            hasToken: !!accessToken,
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('스케줄 API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                '서버 응답 오류 상세:',
                errorText
            );
            throw new Error(
                `서버 응답 오류: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log('스케줄 API 응답 데이터 구조:', {
            hasData: !!data,
            dataKeys: data ? Object.keys(data) : [],
            dataType: Array.isArray(data)
                ? 'array'
                : typeof data,
            dataLength: Array.isArray(data)
                ? data.length
                : 'N/A',
        });

        // 실제 데이터 내용 로깅
        console.log(
            '스케줄 API 전체 응답:',
            JSON.stringify(data, null, 2)
        );

        // 중첩된 데이터 구조 확인
        if (data && typeof data === 'object') {
            console.log('데이터 키들:', Object.keys(data));
            if (data.data) {
                console.log(
                    'data.data 타입:',
                    typeof data.data
                );
                console.log('data.data 내용:', data.data);
                if (Array.isArray(data.data)) {
                    console.log(
                        'data.data 배열 길이:',
                        data.data.length
                    );
                    if (data.data.length > 0) {
                        console.log(
                            '첫 번째 data.data 요소:',
                            data.data[0]
                        );
                    }
                }
            }
        }

        return data;
    } catch (error) {
        console.error('업장 스케줄 조회 오류:', error);
        throw new Error(
            `업장 스케줄 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 사용자용 업장 평판 생성
export const createWorkerReputation = async (
    workspaceId,
    keywordsPayload
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/reputations/requests/workspaces`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    workspaceId: workspaceId,
                    keywords: keywordsPayload,
                }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        console.error('평판 생성 중 오류:', error);
        throw new Error(
            '평판 생성 중 오류가 발생했습니다.'
        );
    }
};
