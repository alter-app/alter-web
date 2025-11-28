/**
 * 네이티브 앱 브릿지 유틸리티
 * Flutter WebView와 통신하기 위한 헬퍼 함수들
 */

/**
 * 네이티브 앱 환경인지 확인
 * @returns {boolean} 네이티브 앱 여부
 */
export const isNativeApp = () => {
    const userAgent = navigator.userAgent || '';
    return userAgent.includes('alter-app-native');
};

/**
 * 로그인 성공 시 네이티브 앱에 인증 데이터 전송 및 FCM 토큰 등록
 * @param {Object} authData - 인증 데이터 (accessToken, refreshToken 등)
 */
export const sendAuthDataToNative = (authData) => {
    if (!isNativeApp()) {
        console.log('[Native Bridge] 웹 환경에서는 네이티브 브릿지를 사용하지 않습니다.');
        return;
    }

    try {
        if (typeof window.sendAuthDataToNative === 'function') {
            console.log('[Native Bridge] 네이티브에 인증 데이터 전송 시작');
            window.sendAuthDataToNative();
            console.log('[Native Bridge] 네이티브에 인증 데이터 전송 완료');
        } else {
            console.warn('[Native Bridge] sendAuthDataToNative 함수를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('[Native Bridge] 인증 데이터 전송 실패:', error);
    }
};

/**
 * 위치 정보 요청
 * @returns {Promise<Object>} 위치 데이터
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!isNativeApp()) {
            reject(new Error('네이티브 앱 환경이 아닙니다.'));
            return;
        }

        try {
            if (typeof window.LocationChannel === 'undefined') {
                reject(new Error('LocationChannel을 찾을 수 없습니다.'));
                return;
            }

            const handleLocationReceived = (event) => {
                window.removeEventListener('locationReceived', handleLocationReceived);
                resolve(event.detail);
            };

            window.addEventListener('locationReceived', handleLocationReceived);

            setTimeout(() => {
                window.removeEventListener('locationReceived', handleLocationReceived);
                reject(new Error('위치 정보 요청 시간 초과'));
            }, 5000);

            window.LocationChannel.postMessage(
                JSON.stringify({
                    action: 'getCurrentLocation',
                })
            );
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * 네이티브 로그 출력
 * @param {string} level - 로그 레벨 (log, error, warn, info, debug)
 * @param {string} message - 로그 메시지
 */
export const nativeLog = (level = 'log', message = '') => {
    if (!isNativeApp()) return;

    try {
        if (typeof window.ConsoleChannel !== 'undefined') {
            window.ConsoleChannel.postMessage(
                JSON.stringify({
                    level,
                    message,
                    timestamp: Date.now(),
                })
            );
        }
    } catch (error) {
        console.error('[Native Bridge] 네이티브 로그 전송 실패:', error);
    }
};

export const sendLogoutToNative = () => {
    if (!isNativeApp()) {
        console.log('[Native Bridge] 웹 환경에서는 네이티브 브릿지를 사용하지 않습니다.');
        return;
    }

    try {
        // 로그아웃 처리 함수 호출 (네이티브)
        if (typeof window.onWebLogout === 'function') {
            console.log('[Native Bridge] 네이티브에 로그아웃 알림 전송 시작');
            window.onWebLogout();
            console.log('[Native Bridge] 네이티브에 로그아웃 알림 전송 완료');
        } else if (typeof window.LogoutChannel !== 'undefined') {
            // Flutter Channel 방식일 경우
            console.log('[Native Bridge] LogoutChannel을 통해 로그아웃 알림 전송');
            window.LogoutChannel.postMessage(
                JSON.stringify({ action: 'logout' })
            );
        } else {
            console.warn('[Native Bridge] 로그아웃 핸들러를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('[Native Bridge] 로그아웃 알림 실패:', error);
    }
};

export default {
    isNativeApp,
    sendAuthDataToNative,
    sendLogoutToNative,
    getCurrentLocation,
    nativeLog,
};

