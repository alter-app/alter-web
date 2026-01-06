// 입력된 문자열을 한국 휴대폰 번호 형식(XXX-XXXX-XXXX)으로 변환합니다.
export const formatPhoneNumber = (value: string | number | null | undefined): string => {
    // 입력값이 없거나 유효하지 않으면 빈 문자열 반환
    if (!value) {
        return '';
    }

    // 문자열로 변환 (혹시 다른 타입일 경우 대비)
    const stringValue = String(value);

    // 정규식 체인을 적용하여 포맷팅
    const formatted = stringValue
        .replace(/[^0-9]/g, '') // 1. 숫자 외 문자 제거 (점(.) 제거됨)
        .replace(
            /^(\d{0,3})(\d{0,4})(\d{0,4})$/,
            '$1-$2-$3'
        ) // 2. 그룹 나누고 하이픈 추가
        .replace(/(\-{1,2})$/, ''); // 3. 끝에 있는 하이픈 1~2개 제거

    // 추가: '--'가 중간에 생기는 경우를 대비해 하나로 변경
    return formatted.replace(/--/g, '-');
};

// 입력된 문자열을 대한민국 E.164 형식 (+82...)으로 변환합니다.
export const formatPhoneNumberToE164 = (value: string | number | null | undefined): string => {
    if (!value) {
        return '';
    }

    // 1. 숫자만 추출
    const digits = String(value).replace(/[^0-9]/g, '');

    // 2. 정규식을 사용하여 '01...' 형태를 '+821...' 형태로 변환
    const e164 = digits.replace(
        /^0(1[0-9]{8,9})$/,
        '+82$1'
    );

    // 3. 변환 결과 확인
    if (e164 === digits) {
        // 이미 +82로 시작하는 유효한 형식인지 체크
        if (/^\+821[0-9]{8,9}$/.test(digits)) {
            return digits; // 이미 올바른 형식이면 그대로 반환
        }
        return ''; // 변환 대상이 아니면 빈 문자열 반환
    } else {
        return e164;
    }
};

