/**
 * ISO 형식의 날짜 문자열을 "~초 전", "~분 전", "~시간 전", "~일 전" 등으로 변환
 * @param {string} isoString - 예: "2025-05-19T23:07:55.55675"
 * @returns {string} - 한글 상대 시간 문자열
 */
export function timeAgo(isoString) {
    if (!isoString) return "";

    // 소수점 이하 마이크로초가 6자리 넘는 경우 잘라내기
    let normalized = isoString;
    if (isoString.includes(".")) {
        const [date, micro] = isoString.split(".");
        normalized = date + "." + micro.substring(0, 6);
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
