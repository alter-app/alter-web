/**
 * 숫자를 3자리마다 쉼표로 구분된 문자열로 변환
 * @param num - 변환할 숫자
 * @returns 포맷된 문자열
 */
export function formatNumber(num: number): string {
    if (typeof num !== "number") return "";
    return num.toLocaleString("ko-KR");
}

