// 근무 시간 초 단위 자르는 함수
export function formatTimeToHHMM(timeStr) {
    if (typeof timeStr !== 'string') return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    return `${parts[0]}:${parts[1]}`;
}

// 총 근무 시간 구하는 함수
export function getWorkDuration(start, end) {
    // "09:00" 또는 "09:00:00" 형태 모두 지원
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    // Date 객체로 변환 (날짜는 임의, 시간만 비교)
    const startDate = new Date(0, 0, 0, sh, sm);
    const endDate = new Date(0, 0, 0, eh, em);

    // 차이(ms) 계산
    let diffMs = endDate - startDate;
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // 자정 넘는 경우 보정

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    // "1시간", "1시간 30분", "30분" 등으로 반환
    if (hours && minutes)
        return `${hours}시간 ${minutes}분`;
    if (hours) return `${hours}시간`;
    return `${minutes}분`;
}

/**
 * ISO 형식의 날짜 문자열을 "~초 전", "~분 전", "~시간 전", "~일 전" 등으로 변환
 * @param {string} isoString - 예: "2025-05-19T23:07:55.55675"
 * @returns {string} - 한글 상대 시간 문자열
 */
export function timeAgo(isoString) {
    if (!isoString) return '';

    // 소수점 이하 마이크로초가 6자리 넘는 경우 잘라내기
    let normalized = isoString;
    if (isoString.includes('.')) {
        const [date, micro] = isoString.split('.');
        normalized = date + '.' + micro.substring(0, 6);
    }

    const date = new Date(normalized);
    const now = new Date();
    const diff = (now - date) / 1000; // 초 단위

    if (diff < 60) {
        return `${Math.floor(diff)}초 전`;
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}시간 전`;
    } else {
        return `${Math.floor(diff / 86400)}일 전`;
    }
}

export function autoInsertColon(value) {
    // 숫자만 추출
    let numbers = value.replace(/\D/g, '').slice(0, 4);

    // 아무것도 없으면 빈 문자열
    if (!numbers) return '';

    // 3~4자리면 HH:MM 형태
    if (numbers.length > 2) {
        let hour = numbers.slice(0, 2);
        let minute = numbers.slice(2, 4);

        // 시간, 분 범위 제한 (입력 중에는 제한하지 않음, 제출 시 검증 추천)
        return `${hour}:${minute}`;
    }
    // 1~2자리면 그냥 시(hour)만
    return numbers;
}

// 가입일자 변환 함수
export function formatJoinDate(isoString) {
    // 소수점 이하(마이크로초) 제거 및 Date 객체 생성
    const date = new Date(isoString.split('.')[0]);
    const year = date.getFullYear();
    // 월과 일은 두 자리로 맞춤
    const month = String(date.getMonth() + 1).padStart(
        2,
        '0'
    );
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
