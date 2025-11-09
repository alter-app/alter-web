import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 매니저 계정 - 관리중인 업장의 점주/매니저 목록 조회
export const getWorkplaceManagers = async (workspaceId) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
        throw new Error(
            '인증 토큰이 없습니다. 다시 로그인해주세요.'
        );
    }

    if (!workspaceId) {
        throw new Error('업장 ID가 필요합니다.');
    }

    try {
        const url = `${backend}/manager/workspaces/${workspaceId}/managers?pageSize=10`;

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

            if (response.status === 401) {
                throw new Error(
                    '인증이 만료되었습니다. 다시 로그인해주세요.'
                );
            } else if (response.status === 403) {
                throw new Error(
                    '해당 업장에 대한 접근 권한이 없습니다.'
                );
            } else if (response.status === 404) {
                throw new Error('업장을 찾을 수 없습니다.');
            } else {
                throw new Error(
                    `서버 응답 오류: ${response.status} ${response.statusText}`
                );
            }
        }

        const data = await response.json();
        console.log(
            '매니저 계정 - 점주/매니저 API 응답 데이터:',
            data
        );

        // 데이터 유효성 검사
        if (!data || typeof data !== 'object') {
            throw new Error(
                '서버에서 잘못된 데이터를 반환했습니다.'
            );
        }

        return data;
    } catch (error) {
        console.error(
            '매니저 계정 - 점주/매니저 조회 오류:',
            error
        );

        if (error.message.includes('Failed to fetch')) {
            throw new Error(
                '네트워크 연결을 확인해주세요.'
            );
        }

        throw error;
    }
};

// 매니저 계정 - 관리중인 업장의 알바생 목록 조회
export const getWorkplaceWorkers = async (workspaceId) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
        throw new Error(
            '인증 토큰이 없습니다. 다시 로그인해주세요.'
        );
    }

    if (!workspaceId) {
        throw new Error('업장 ID가 필요합니다.');
    }

    try {
        const url = `${backend}/manager/workspaces/${workspaceId}/workers?pageSize=10`;

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

            if (response.status === 401) {
                throw new Error(
                    '인증이 만료되었습니다. 다시 로그인해주세요.'
                );
            } else if (response.status === 403) {
                throw new Error(
                    '해당 업장에 대한 접근 권한이 없습니다.'
                );
            } else if (response.status === 404) {
                throw new Error('업장을 찾을 수 없습니다.');
            } else {
                throw new Error(
                    `서버 응답 오류: ${response.status} ${response.statusText}`
                );
            }
        }

        const data = await response.json();
        console.log(
            '매니저 계정 - 알바생 API 응답 데이터:',
            data
        );

        // 데이터 유효성 검사
        if (!data || typeof data !== 'object') {
            throw new Error(
                '서버에서 잘못된 데이터를 반환했습니다.'
            );
        }

        return data;
    } catch (error) {
        console.error(
            '매니저 계정 - 알바생 조회 오류:',
            error
        );

        if (error.message.includes('Failed to fetch')) {
            throw new Error(
                '네트워크 연결을 확인해주세요.'
            );
        }

        throw error;
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

// 매니저 계정 - 관리중인 업장의 스케줄 조회
export const getWorkplaceSchedule = async (
    workspaceId,
    year,
    month
) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
        throw new Error(
            '인증 토큰이 없습니다. 다시 로그인해주세요.'
        );
    }

    if (!workspaceId) {
        throw new Error('업장 ID가 필요합니다.');
    }

    try {
        const url = `${backend}/manager/schedules?workspaceId=${workspaceId}&year=${year}&month=${month}`;

        console.log(
            '매니저 계정 - 업장 스케줄 조회 API 요청:',
            {
                url,
                workspaceId,
                year,
                month,
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

        console.log('매니저 계정 - 스케줄 API 응답 상태:', {
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

            if (response.status === 401) {
                throw new Error(
                    '인증이 만료되었습니다. 다시 로그인해주세요.'
                );
            } else if (response.status === 403) {
                throw new Error(
                    '해당 업장에 대한 접근 권한이 없습니다.'
                );
            } else if (response.status === 404) {
                throw new Error('업장을 찾을 수 없습니다.');
            } else {
                throw new Error(
                    `서버 응답 오류: ${response.status} ${response.statusText}`
                );
            }
        }

        const data = await response.json();
        console.log(
            '매니저 계정 - 스케줄 API 응답 데이터 구조:',
            {
                hasData: !!data,
                dataKeys: data ? Object.keys(data) : [],
                dataType: Array.isArray(data)
                    ? 'array'
                    : typeof data,
                dataLength: Array.isArray(data)
                    ? data.length
                    : 'N/A',
            }
        );

        // 실제 데이터 내용 로깅
        console.log(
            '매니저 계정 - 스케줄 API 전체 응답:',
            JSON.stringify(data, null, 2)
        );

        return data;
    } catch (error) {
        console.error(
            '매니저 계정 - 업장 스케줄 조회 오류:',
            error
        );
        throw new Error(
            `업장 스케줄 조회 중 오류가 발생했습니다: ${error.message}`
        );
    }
};

// 지도 공고 리스트 조회 로직 (커서 페이징)
export const getMapJobPostings = async (
    coordinate1,
    coordinate2,
    {
        cursorInfo = '',
        pageSize = 10,
        searchKeyword = '',
        sortType = 'LATEST',
    } = {}
) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const params = new URLSearchParams({
            'coordinate1.latitude': coordinate1.latitude,
            'coordinate1.longitude': coordinate1.longitude,
            'coordinate2.latitude': coordinate2.latitude,
            'coordinate2.longitude': coordinate2.longitude,
            pageSize: pageSize.toString(),
            sortType,
        });

        if (cursorInfo) {
            params.append('cursor', cursorInfo);
        }

        if (searchKeyword) {
            params.append('searchKeyword', searchKeyword);
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
            `${backend}/app/postings/workspaces/${workspaceId}`,
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
