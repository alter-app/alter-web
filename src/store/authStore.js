import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    sendAuthDataToNative,
    sendLogoutToNative,
} from '../utils/nativeAppBridge';

const useAuthStore = create(
    persist(
        (set) => ({
            // 인증 관련 상태
            accessToken: '',
            refreshToken: '',
            authorizationId: '',
            scope: '',
            isLoggedIn: false,
            showTokenExpiredModal: false,

            // 로그인 액션
            setAuth: (authData) => {
                set({
                    accessToken: authData.accessToken,
                    refreshToken: authData.refreshToken,
                    authorizationId:
                        authData.authorizationId,
                    scope: authData.scope,
                    isLoggedIn: true,
                    showTokenExpiredModal: false,
                });

                // 네이티브 앱에 인증 데이터 전송 및 FCM 토큰 등록
                // localStorage에 저장된 후 실행되도록 setTimeout 사용
                setTimeout(() => {
                    sendAuthDataToNative(authData);
                }, 100);
            },

            // 로그아웃 액션
            logout: () => {
                set({
                    accessToken: '',
                    refreshToken: '',
                    authorizationId: '',
                    scope: '',
                    isLoggedIn: false,
                    showTokenExpiredModal: false,
                });

                // 네이티브 앱에도 로그아웃 알림 전송
                // localStorage에서 제거된 후 실행되도록 setTimeout 사용
                setTimeout(() => {
                    sendLogoutToNative();
                }, 100);
            },

            // 토큰 만료 모달 표시
            openTokenExpiredModal: () => {
                set({ showTokenExpiredModal: true });
            },

            // 토큰 만료 모달 닫기
            closeTokenExpiredModal: () => {
                set({ showTokenExpiredModal: false });
            },
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
            // showTokenExpiredModal은 localStorage에 저장하지 않음
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                authorizationId: state.authorizationId,
                scope: state.scope,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);

export default useAuthStore;
