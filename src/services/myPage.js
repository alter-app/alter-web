import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// 공고 스크랩 리스트 목록 조회 로직
export const getScrapPostList = async ({ cursorInfo }) => {
    const accessToken = useAuthStore.getState().accessToken;
    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/favorites?cursor=${cursorInfo}&pageSize=10`,
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
            '공고 스크랩 리스트 목록 조회 오류:',
            error
        );
        throw new Error(
            '공고 스크랩 리스트 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 목록 조회 로직 (커서 페이징 및 상태 필터링 지원)
export const getApplicationList = async ({
    pageSize = 10,
    cursor = null,
    status = null,
}) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        let url = `${backend}/app/users/me/postings/applications?pageSize=${pageSize}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }
        if (status && status.length > 0) {
            // status 배열을 쿼리 파라미터로 변환
            const statusParams = status
                .map((s) => `status=${s}`)
                .join('&');
            url += `&${statusParams}`;
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
        console.error('공고 지원 목록 조회 오류:', error);
        throw new Error(
            '공고 지원 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 공고 지원 취소 로직
export const cancelApplication = async ({
    applicationId,
}) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me/postings/applications/${applicationId}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    status: 'CANCELLED',
                }),
            }
        );
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('공고 지원 취소 중 오류:', error);
        throw new Error(
            '공고 지원 취소 중 오류가 발생했습니다.'
        );
    }
};

// 사용자 정보 조회 로직
export const getUserInfo = async () => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me`,
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
        console.error('사용자 정보 조회 오류:', error);
        throw new Error(
            '사용자 정보 조회 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 목록 조회 로직
export const getCertificates = async () => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me/certificates`,
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
        console.error('자격 정보 목록 조회 오류:', error);
        throw new Error(
            '자격 정보 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 삭제 로직
export const deleteCertificates = async ({
    certificateId,
}) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me/certificates/${certificateId}`,
            {
                method: 'DELETE',
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
        console.error('자격 정보 삭제 중 오류:', error);
        throw new Error(
            '자격 정보 삭제 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 등록 로직
export const addCertificates = async (addCertificate) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me/certificates`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    type: 'CERTIFICATE',
                    ...addCertificate,
                }),
            }
        );
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('자격 정보 등록 중 오류:', error);
        throw new Error(
            '자격 정보 등록 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 수정 로직
export const eidtCertificates = async (
    editCertificate,
    certificateId
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me/certificates/${certificateId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    type: 'CERTIFICATE',
                    ...editCertificate,
                }),
            }
        );
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('자격 정보 수정 중 오류:', error);
        throw new Error(
            '자격 정보 수정 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 상세 조회 로직
export const getCertificateDetail = async (
    certificateId
) => {
    const accessToken = useAuthStore.getState().accessToken;

    try {
        const response = await fetch(
            `${backend}/app/users/me/certificates/${certificateId}`,
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
        console.error('자격 정보 상세 조회 오류:', error);
        throw new Error(
            '자격 정보 상세 조회 중 오류가 발생했습니다.'
        );
    }
};
