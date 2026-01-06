/**
 * 위치 정보 획득 유틸리티
 * Flutter 하이브리드 앱과 웹 브라우저 환경을 모두 지원
 */

interface LocationData {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    source: 'flutter' | 'web' | 'default';
}

declare global {
    interface Window {
        LocationChannel?: {
            postMessage: (message: string) => void;
        };
        flutter_inappwebview?: unknown;
        flutter_webview?: unknown;
    }
    
    // LocationChannel을 전역 변수로도 사용 가능하도록
    var LocationChannel: {
        postMessage: (message: string) => void;
    } | undefined;
}

// 위치정보 획득 타임아웃
const LOCATION_TIMEOUT = 30000;

/**
 * 네이티브 환경 여부를 판단하는 단순화된 함수
 * @returns 네이티브 환경 여부
 */
export const isNative = (): boolean => {
    const userAgent = navigator.userAgent || '';
    
    // 1. UserAgent 기반 검증
    const isNativeUserAgent = userAgent.includes('alter-app-native');
    
    // 2. 필수적인 검증 사항들
    const hasNativeFeatures = Boolean(
        (typeof LocationChannel !== 'undefined' && LocationChannel !== null) ||
        window.flutter_inappwebview || 
        window.flutter_webview
    );
    
    // 디버깅을 위한 로그
    console.log('네이티브 환경 감지:', {
        userAgent: userAgent,
        isNativeUserAgent: isNativeUserAgent,
        hasLocationChannel: typeof LocationChannel !== 'undefined',
        hasFlutterInAppWebView: !!window.flutter_inappwebview,
        hasFlutterWebView: !!window.flutter_webview,
        hasNativeFeatures: hasNativeFeatures,
        isNative: isNativeUserAgent && hasNativeFeatures
    });
    
    // UserAgent 검증 + 필수 기능 검증을 모두 통과해야 네이티브로 판단
    return isNativeUserAgent && hasNativeFeatures;
};

/**
 * Flutter 앱에서 위치 정보 요청
 * @returns 위치 정보 객체
 */
export const getNativeLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
        // Flutter 앱의 LocationChannel JavaScript 채널 사용
        if (typeof LocationChannel !== 'undefined') {
            console.log('LocationChannel을 통한 위치 정보 요청');
            
            // Flutter 앱에 위치 정보 요청
            LocationChannel.postMessage(JSON.stringify({
                action: 'getCurrentLocation'
            }));
            
            interface LocationEventDetail {
                latitude: number;
                longitude: number;
                accuracy: number;
                timestamp?: number;
            }

            interface ErrorEventDetail {
                type: string;
                error: string;
            }
            
            // Flutter 응답 리스너
            const handleLocationReceived = (event: CustomEvent<LocationEventDetail>) => {
                console.log('Flutter에서 위치 정보 수신:', event.detail);
                window.removeEventListener('locationReceived', handleLocationReceived as EventListener);
                window.removeEventListener('nativeError', handleNativeError as EventListener);
                
                const { latitude, longitude, accuracy } = event.detail;
                resolve({
                    latitude: latitude,
                    longitude: longitude,
                    accuracy: accuracy,
                    source: 'flutter'
                });
            };
            
            const handleNativeError = (event: CustomEvent<ErrorEventDetail>) => {
                console.log('Flutter 위치 정보 에러:', event.detail);
                window.removeEventListener('locationReceived', handleLocationReceived as EventListener);
                window.removeEventListener('nativeError', handleNativeError as EventListener);
                
                const { type, error } = event.detail;
                console.log('에러 타입:', type, '에러 메시지:', error);
                
                if (type === 'location') {
                    // 권한 관련 에러인 경우 특별 처리
                    if (error.includes('permission') || error.includes('권한') || error.includes('Location permission not granted')) {
                        console.log('위치 권한 에러 감지');
                        reject(new Error(`위치 권한이 필요합니다. 앱 설정에서 위치 권한을 허용해주세요: ${error}`));
                    } else {
                        console.log('기타 위치 에러');
                        reject(new Error(`Flutter 위치 정보 실패: ${error}`));
                    }
                } else {
                    console.log('통신 에러');
                    reject(new Error('Flutter 통신 에러'));
                }
            };
            
            window.addEventListener('locationReceived', handleLocationReceived as EventListener);
            window.addEventListener('nativeError', handleNativeError as EventListener);
            
            // 타임아웃 설정
            setTimeout(() => {
                window.removeEventListener('locationReceived', handleLocationReceived as EventListener);
                window.removeEventListener('nativeError', handleNativeError as EventListener);
                reject(new Error('Flutter 위치 요청 타임아웃'));
            }, LOCATION_TIMEOUT);
            
        } else {
            reject(new Error('LocationChannel이 정의되지 않음 - Flutter 통신 불가'));
        }
    });
};

/**
 * 웹 브라우저에서 Geolocation API 사용
 * @returns 위치 정보 객체
 */
export const getWebLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation API를 지원하지 않습니다.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    source: 'web'
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: LOCATION_TIMEOUT,
                maximumAge: 0
            }
        );
    });
};

/**
 * 통합 위치 정보 획득 함수
 * Flutter 앱 환경에서는 네이티브 위치 정보를 우선 사용하고,
 * 실패 시 웹 Geolocation API로 폴백
 * @returns 위치 정보 객체
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
    // 1. Flutter 하이브리드 앱 환경인지 확인
    if (isNative()) {
        try {
            console.log('네이티브 앱 환경: 네이티브 위치 정보 요청');
            return await getNativeLocation();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log('네이티브 위치 정보 획득 실패, 웹 API로 폴백:', errorMessage);
            // Flutter 실패 시 웹 API로 폴백
            try {
                return await getWebLocation();
            } catch (webError) {
                const webErrorMessage = webError instanceof Error ? webError.message : String(webError);
                console.log('웹 위치 정보 획득 실패:', webErrorMessage);
                throw webError;
            }
        }
    } else {
        // 2. 웹 브라우저 환경
        try {
            console.log('웹 브라우저 환경: Geolocation API 사용');
            return await getWebLocation();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log('웹 위치 정보 획득 실패:', errorMessage);
            throw error;
        }
    }
};

/**
 * 기본 위치 정보 (서울 시청)
 * @returns 기본 위치 정보
 */
export const getDefaultLocation = (): LocationData => {
    return {
        latitude: 37.5665,  // 서울 시청
        longitude: 126.978,
        accuracy: null,
        source: 'default'
    };
};

/**
 * 폴백을 포함한 최종 위치 정보 획득 함수
 * 모든 방법이 실패해도 기본값을 반환
 * @returns 위치 정보 객체
 */
export const getLocationWithFallback = async (): Promise<LocationData> => {
    try {
        return await getCurrentLocation();
    } catch (error) {
        console.log('모든 위치 정보 획득 방법 실패, 기본값 사용');
        return getDefaultLocation();
    }
};

