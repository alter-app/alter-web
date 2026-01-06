interface FieldError {
    field: string;
    message: string;
}

interface ErrorResponse {
    data?: FieldError[];
    message?: string;
}

interface ParsedError {
    fieldErrors: Record<string, string>;
    globalError: string | null;
}

// 백엔드 에러 응답을 파싱하여 fieldErrors와 globalError 메시지로 변환
export const parseErrorResponse = (errorData: ErrorResponse | null | undefined): ParsedError => {
    const fieldErrors: Record<string, string> = {};
    let globalError: string | null = null;

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
        globalError = errorData.message;
    }

    return {
        fieldErrors,
        globalError,
    };
};

