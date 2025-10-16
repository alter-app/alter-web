import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendAuthDataToNative } from '../utils/nativeAppBridge';

const useAuthStore = create(
    persist(
        (set) => ({
            // 인증 관련 상태
            accessToken: '',
            refreshToken: '',
            authorizationId: '',
            scope: '',
            isLoggedIn: false,

            // 로그인 액션
            setAuth: (authData) => {
                set({
                    accessToken: authData.accessToken,
                    refreshToken: authData.refreshToken,
                    authorizationId:
                        authData.authorizationId,
                    scope: authData.scope,
                    isLoggedIn: true,
                });

                // 네이티브 앱에 인증 데이터 전송 및 FCM 토큰 등록
                // localStorage에 저장된 후 실행되도록 setTimeout 사용
                setTimeout(() => {
                    sendAuthDataToNative(authData);
                }, 100);
            },

            // 로그아웃 액션
            logout: () =>
                set({
                    accessToken: '',
                    refreshToken: '',
                    authorizationId: '',
                    scope: '',
                    isLoggedIn: false,
                }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useAuthStore;
