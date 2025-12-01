// 백엔드 에러 응답을 파싱하여 fieldErrors와 global 메시지로 변환
export const parseErrorResponse = (errorData) => {
    const fieldErrors = {};
    let global = null;

    // data 배열이 있는 경우 (필드별 에러)
    if (errorData?.data && Array.isArray(errorData.data)) {
        errorData.data.forEach((fieldError) => {
            if (fieldError.field && fieldError.message) {
                fieldErrors[fieldError.field] =
                    fieldError.message;
            }
        });
    }

    // 일반 에러 메시지
    if (errorData?.message) {
        global = errorData.message;
    }

    return {
        fieldErrors,
        global,
    };
};
