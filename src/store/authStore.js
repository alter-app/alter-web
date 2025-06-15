import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
            setAuth: (authData) =>
                set({
                    accessToken: authData.accessToken,
                    refreshToken: authData.refreshToken,
                    authorizationId:
                        authData.authorizationId,
                    scope: authData.scope,
                    isLoggedIn: true,
                }),

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
