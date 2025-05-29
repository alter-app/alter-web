/**
 * paymentType 값을 한국어로 변환
 * @param {string} type - 예: "HOURLY", "MONTHLY", "YEARLY" 등
 * @returns {string} - 예: "시급", "월급", "연봉" 등
 */
export function paymentTypeToKorean(type) {
    switch (type) {
        case 'HOURLY':
            return '시급';
        case 'DAILY':
            return '일급';
        case 'WEEKLY':
            return '주급';
        case 'MONTHLY':
            return '월급';
        default:
            return type; // 알 수 없는 값은 그대로 반환
    }
}
