import apiClient from '../utils/apiClient';

// 공고 스크랩 리스트 목록 조회 로직
export const getScrapPostList = async ({ cursorInfo }) => {
    try {
        const response = await apiClient.get('/app/users/me/postings/favorites', {
            params: {
                cursor: cursorInfo,
                pageSize: 10,
            },
        });

        return response.data;
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
    try {
        const params = { pageSize };
        if (cursor) {
            params.cursor = cursor;
        }
        if (status && status.length > 0) {
            // status 배열을 반복 파라미터로 변환 (status[] 대신 status=value&status=value 형식)
            params.status = status;
        }

        const response = await apiClient.get(
            '/app/users/me/postings/applications',
            {
                params,
                paramsSerializer: (params) => {
                    const searchParams = new URLSearchParams();
                    Object.keys(params).forEach((key) => {
                        const value = params[key];
                        if (Array.isArray(value)) {
                            // 배열인 경우 각 값을 반복 파라미터로 추가
                            value.forEach((item) => {
                                searchParams.append(key, item);
                            });
                        } else if (value !== null && value !== undefined) {
                            searchParams.append(key, value);
                        }
                    });
                    return searchParams.toString();
                },
            }
        );

        return response.data;
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
    try {
        const response = await apiClient.patch(
            `/app/users/me/postings/applications/${applicationId}/status`,
            {
                status: 'CANCELLED',
            }
        );

        return response.data;
    } catch (error) {
        console.error('공고 지원 취소 중 오류:', error);
        throw new Error(
            '공고 지원 취소 중 오류가 발생했습니다.'
        );
    }
};

// 사용자 정보 조회 로직
export const getUserInfo = async () => {
    try {
        const response = await apiClient.get('/app/users/me');
        return response.data;
    } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        throw new Error(
            '사용자 정보 조회 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 목록 조회 로직
export const getCertificates = async () => {
    try {
        const response = await apiClient.get('/app/users/me/certificates');
        return response.data;
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
    try {
        const response = await apiClient.delete(
            `/app/users/me/certificates/${certificateId}`
        );

        return response.data;
    } catch (error) {
        console.error('자격 정보 삭제 중 오류:', error);
        throw new Error(
            '자격 정보 삭제 중 오류가 발생했습니다.'
        );
    }
};

// 자격 정보 등록 로직
export const addCertificates = async (addCertificate) => {
    try {
        const response = await apiClient.post('/app/users/me/certificates', {
            type: 'CERTIFICATE',
            ...addCertificate,
        });

        return response.data;
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
    try {
        const response = await apiClient.put(
            `/app/users/me/certificates/${certificateId}`,
            {
                type: 'CERTIFICATE',
                ...editCertificate,
            }
        );

        return response.data;
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
    try {
        const response = await apiClient.get(
            `/app/users/me/certificates/${certificateId}`
        );

        return response.data;
    } catch (error) {
        console.error('자격 정보 상세 조회 오류:', error);
        throw new Error(
            '자격 정보 상세 조회 중 오류가 발생했습니다.'
        );
    }
};
