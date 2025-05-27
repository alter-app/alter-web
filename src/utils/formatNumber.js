/**
 * 숫자를 3자리마다 쉼표로 구분된 문자열로 변환
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
    if (typeof num !== "number") return "";
    return num.toLocaleString("ko-KR");
}
