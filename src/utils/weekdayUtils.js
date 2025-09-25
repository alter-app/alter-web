// 요일 관련 공용 상수 및 유틸리티 함수

export const WEEKDAYS_KOR = {
    SUNDAY: '일',
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
};

export const WEEKDAYS_KOR_ARRAY = [
    { key: 'SUNDAY', label: '일' },
    { key: 'MONDAY', label: '월' },
    { key: 'TUESDAY', label: '화' },
    { key: 'WEDNESDAY', label: '수' },
    { key: 'THURSDAY', label: '목' },
    { key: 'FRIDAY', label: '금' },
    { key: 'SATURDAY', label: '토' },
];

// 요일 키를 한국어로 변환하는 함수
export const getWeekdayLabel = (weekdayKey) => {
    return WEEKDAYS_KOR[weekdayKey] || weekdayKey;
};

// 요일 배열을 한국어 라벨로 변환하는 함수
export const getWeekdayLabels = (weekdayKeys) => {
    return weekdayKeys.map(key => WEEKDAYS_KOR[key] || key);
};
