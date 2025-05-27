// 요일 순서 배열
export const WEEKDAYS_ORDER = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

// 요일 정렬 함수
export function sortWeekdays(days) {
    if (!Array.isArray(days)) return [];
    return [...days].sort(
        (a, b) =>
            WEEKDAYS_ORDER.indexOf(a) -
            WEEKDAYS_ORDER.indexOf(b)
    );
}

// 영문 요일 → 한글 요일 매핑 객체
const DAY_KOR_MAP = {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일',
};

// 변환 함수
export function getKoreanDays(englishDays) {
    if (!Array.isArray(englishDays)) return '';
    return englishDays
        .map((day) => DAY_KOR_MAP[day] || day)
        .join(', ');
}
