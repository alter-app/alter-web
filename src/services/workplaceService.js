import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 매니저 계정 - 관리중인 업장의 점주/매니저 목록 조회
export const getWorkplaceManagers = async (workspaceId) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const url = `${backend}/manager/workspaces/${workspaceId}/managers`;

        console.log(
            '매니저 계정 - 점주/매니저 조회 API 요청:',
            {
                url,
                workspaceId,
                hasToken: !!accessToken,
            }
        );

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log(
            '매니저 계정 - 점주/매니저 API 응답 상태:',
            {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
            }
        );

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
        console.log(
            '매니저 계정 - 점주/매니저 API 응답 데이터:',
            data
        );
        return data;
    } catch (error) {
        console.error(
            '매니저 계정 - 점주/매니저 조회 오류:',
            error
        );
        throw new Error(
            `점주/매니저 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 매니저 계정 - 관리중인 업장의 알바생 목록 조회
export const getWorkplaceWorkers = async (workspaceId) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const url = `${backend}/manager/workspaces/${workspaceId}/workers`;

        console.log('매니저 계정 - 알바생 조회 API 요청:', {
            url,
            workspaceId,
            hasToken: !!accessToken,
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('매니저 계정 - 알바생 API 응답 상태:', {
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
        console.log(
            '매니저 계정 - 알바생 API 응답 데이터:',
            data
        );
        return data;
    } catch (error) {
        console.error(
            '매니저 계정 - 알바생 조회 오류:',
            error
        );
        throw new Error(
            `알바생 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 근무자 조회 로직 (기존 함수 유지 - 호환성)
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

// 지도 마커 조회 로직
export const getMapMarkers = async (
    coordinate1,
    coordinate2
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const params = new URLSearchParams({
            'coordinate1.latitude': coordinate1.latitude,
            'coordinate1.longitude': coordinate1.longitude,
            'coordinate2.latitude': coordinate2.latitude,
            'coordinate2.longitude': coordinate2.longitude,
        });

        const response = await fetch(
            `${backend}/app/postings/map/markers?${params}`,
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
        console.error('지도 마커 조회 오류:', error);
        throw new Error(
            '지도 마커 조회 중 오류가 발생했습니다.'
        );
    }
};

// 지도 공고 리스트 조회 로직 (커서 페이징)
export const getMapJobPostings = async (
    coordinate1,
    coordinate2,
    cursorInfo = '',
    pageSize = 10
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const params = new URLSearchParams({
            'coordinate1.latitude': coordinate1.latitude,
            'coordinate1.longitude': coordinate1.longitude,
            'coordinate2.latitude': coordinate2.latitude,
            'coordinate2.longitude': coordinate2.longitude,
            pageSize: pageSize.toString(),
        });

        if (cursorInfo) {
            params.append('cursor', cursorInfo);
        }

        const response = await fetch(
            `${backend}/app/postings/map?${params}`,
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
        console.error('지도 공고 리스트 조회 오류:', error);
        throw new Error(
            '지도 공고 리스트 조회 중 오류가 발생했습니다.'
        );
    }
};

// 특정 업장의 공고 목록 조회 로직
export const getWorkspacePostings = async (workspaceId) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/postings/workspace/${workspaceId}`,
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
        console.error('업장 공고 목록 조회 오류:', error);
        throw new Error(
            '업장 공고 목록 조회 중 오류가 발생했습니다.'
        );
    }
};
