// 요일 순서 배열
export const WEEKDAYS_ORDER = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
] as const;

type Weekday = typeof WEEKDAYS_ORDER[number];

// 요일 정렬 함수
export function sortWeekdays(days: string[]): string[] {
    if (!Array.isArray(days)) return [];
    return [...days].sort(
        (a, b) =>
            WEEKDAYS_ORDER.indexOf(a as Weekday) -
            WEEKDAYS_ORDER.indexOf(b as Weekday)
    );
}

// 영문 요일 → 한글 요일 매핑 객체
const DAY_KOR_MAP: Record<string, string> = {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일',
};

// 변환 함수
export function getKoreanDays(englishDays: string[]): string {
    if (!Array.isArray(englishDays)) return '';
    return englishDays
        .map((day) => DAY_KOR_MAP[day] || day)
        .join(', ');
}

// 날짜 입력 시 하이폰 추가
export function formatDateInput(value: string): string {
    // 숫자만 남기고 하이픈 추가 (YYYY-MM-DD)
    const v = value.replace(/\D/g, '').slice(0, 8);
    if (v.length < 5) return v;
    if (v.length < 7)
        return v.slice(0, 4) + '-' + v.slice(4);
    return (
        v.slice(0, 4) +
        '-' +
        v.slice(4, 6) +
        '-' +
        v.slice(6, 8)
    );
}

// 날짜에 . 추가
export const formatBirthday = (birthday: string | null | undefined): string => {
    if (!birthday || birthday.length !== 8) return '-';
    return `${birthday.slice(0, 4)}.${birthday.slice(
        4,
        6
    )}.${birthday.slice(6, 8)}.`;
};

