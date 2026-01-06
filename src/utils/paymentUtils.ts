/**
 * paymentType 값을 한국어로 변환
 * @param type - 예: "HOURLY", "MONTHLY", "YEARLY" 등
 * @returns 예: "시급", "월급", "연봉" 등
 */
export function paymentTypeToKorean(type: string): string {
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

export function calculateHourlyWage(
    payType: string,
    value: string | number,
    workHour: string | number
): number {
    const wage = Number(value);
    const hours = Number(workHour);

    if (!wage || !hours) return 0;

    switch (payType) {
        case 'HOURLY':
            return wage;
        case 'DAILY':
            // 일급 ÷ 하루 근무시간
            return wage / hours;
        case 'WEEKLY':
            // 주급 ÷ (하루 근무시간 × 5일 or 6일 등, 임시로 5일로 가정)
            // 실제 근무일수(주당) 입력받으면 더 정확
            return wage / (hours * 5);
        case 'MONTHLY':
            // 월급 ÷ (하루 근무시간 × 월평균 근무일수, 임시로 21.5일로 가정)
            return wage / (hours * 21.5);
        default:
            return 0;
    }
}

