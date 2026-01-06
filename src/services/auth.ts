import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithCredential,
    ConfirmationResult,
    UserCredential,
} from 'firebase/auth';
import { auth } from '../firebase.config';
import useAuthStore from '../store/authStore';
import apiClient from '../utils/apiClient';
import { AuthData } from '../types';
import { NavigateFunction } from 'react-router-dom';

const backend = import.meta.env.VITE_API_URL;

// Window 객체에 추가되는 속성들에 대한 타입 정의
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier | null;
        recaptchaWidgetId: number | undefined;
        grecaptcha?: {
            reset: (widgetId: number) => void;
        };
    }
}

// Firebase 에러 타입
interface FirebaseError {
    code?: string;
    message?: string;
}

// reCAPTCHA 초기화
export async function initializeRecaptcha(
    containerId: string = 'recaptcha-container',
    onVerified?: (response: string) => void
): Promise<RecaptchaVerifier | null> {
    try {
        // 1. 이미 인스턴스가 있고 위젯도 렌더링된 상태라면 기존 것 반환
        if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined) {
            return window.recaptchaVerifier;
        }

        // 2. DOM 요소 정리 (중복 렌더링 방지)
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }

        // 3. 인스턴스 생성
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            containerId,
            {
                size: 'invisible',
                callback: (response: string) => {
                    if (onVerified) onVerified(response);
                },
                'expired-callback': () => {
                    resetRecaptcha(); // 만료 시 리셋
                    alert('reCAPTCHA가 만료되었습니다. 다시 시도해주세요.');
                },
                'error-callback': (error: Error) => {
                    console.error('reCAPTCHA error callback:', error);
                    // 401 에러 등 초기화 실패 시 처리
                    if (window.recaptchaVerifier) {
                        try {
                            window.recaptchaVerifier.clear();
                        } catch (e) {
                            console.error('Error clearing recaptcha:', e);
                        }
                        window.recaptchaVerifier = null;
                        window.recaptchaWidgetId = undefined;
                    }
                },
            }
        );

        // 4. 렌더링 후 Widget ID 저장 (핵심: reset을 위해 필요)
        const widgetId = await window.recaptchaVerifier.render();
        window.recaptchaWidgetId = widgetId;

        return window.recaptchaVerifier;
    } catch (error) {
        console.warn('Recaptcha initialization warning:', error);
        // 이미 렌더링된 경우 등은 기존 인스턴스 사용 시도
        if (window.recaptchaVerifier) return window.recaptchaVerifier;
        return null;
    }
}

// reCAPTCHA 정리 (완전 삭제)
export function clearRecaptcha(containerId: string = 'recaptcha-container'): void {
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch (e) {
            console.warn(e);
        }
    }
    window.recaptchaVerifier = null;
    window.recaptchaWidgetId = undefined; // ID도 초기화

    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// reCAPTCHA 리셋 (에러 수정됨)
export function resetRecaptcha(): void {
    // window.recaptchaVerifier.reset()은 존재하지 않는 함수입니다.
    // 대신 grecaptcha.reset(widgetId)를 사용해야 합니다.
    if (window.grecaptcha && window.recaptchaWidgetId !== undefined) {
        try {
            window.grecaptcha.reset(window.recaptchaWidgetId);
        } catch (error) {
            console.error('Error resetting recaptcha widget:', error);
        }
    }
}

// reCAPTCHA 인증번호 전송
export async function sendPhoneVerification(phoneNumber: string): Promise<string> {
    if (!window.recaptchaVerifier) {
        // 인스턴스가 없으면 재초기화 시도 (방어 코드)
        await initializeRecaptcha();
    }

    // 그래도 없으면 에러
    if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA 초기화에 실패했습니다. 새로고침 후 다시 시도해주세요.');
    }

    try {
        const verifier = window.recaptchaVerifier;
        const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            verifier
        );
        return confirmationResult.verificationId;
    } catch (error) {
        // 실패 시 리셋하여 다시 시도 가능하게 함
        resetRecaptcha();

        const firebaseError = error as FirebaseError;
        // 에러 메시지 매핑
        throw new Error(getFirebaseErrorMsg(firebaseError.code));
    }
}

// reCAPTCHA 인증번호 검증
export async function verifyPhoneCode(
    verificationId: string,
    code: string
): Promise<string | undefined> {
    try {
        const credential = PhoneAuthProvider.credential(
            verificationId,
            code
        );
        const result: UserCredential = await signInWithCredential(
            auth,
            credential
        );
        return result.user?.phoneNumber || undefined;
    } catch (error) {
        const firebaseError = error as FirebaseError;
        throw new Error(getFirebaseErrorMsg(firebaseError.code));
    }
}

// Firebase 에러 메시지 매핑
function getFirebaseErrorMsg(code?: string): string {
    switch (code) {
        case 'auth/invalid-phone-number':
            return '잘못된 전화번호 형식입니다.';
        case 'auth/too-many-requests':
            return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        case 'auth/code-expired':
            return '인증번호가 만료되었습니다. 다시 요청해주세요.';
        case 'auth/invalid-verification-code':
            return '잘못된 인증번호입니다.';
        case 'auth/recaptcha-not-enabled':
            return 'reCAPTCHA가 활성화되지 않았습니다. Firebase 콘솔에서 설정을 확인하세요.';
        case 'auth/recaptcha-error':
            return 'reCAPTCHA 인증에 실패했습니다. 페이지를 새로고침하고 다시 시도해주세요.';
        default:
            // code가 없거나 알 수 없는 에러인 경우 원본 메시지 포함
            if (code && typeof code === 'string') {
                if (code.includes('401') || code.includes('Unauthorized')) {
                    return '관리자 설정 오류: API 키 권한을 확인해주세요.';
                }
            }
            return '인증 처리 중 오류가 발생했습니다.';
    }
}

// 닉네임 중복 검사 로직
export const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
    try {
        const response = await apiClient.post<{
            data: { duplicated: boolean };
        }>(
            '/public/users/exists/nickname',
            { nickname }
        );

        return response.data.data.duplicated === false;
    } catch (error) {
        console.error('닉네임 중복 검사 오류:', error);
        throw new Error(
            '닉네임 중복 검사 중 오류가 발생했습니다.'
        );
    }
};

interface EmailDuplicateResponse {
    success: boolean;
    duplicated?: boolean;
    message?: string;
}

interface FieldError {
    field: string;
    message: string;
}

interface ErrorResponse {
    response?: {
        data?: {
            data?: FieldError[];
            message?: string;
        };
    };
}

// 이메일 중복 검사 로직
export const checkEmailDuplicate = async (email: string): Promise<EmailDuplicateResponse> => {
    try {
        const response = await apiClient.post<{
            data: { duplicated: boolean };
        }>(
            '/public/users/exists/email',
            { email }
        );

        return {
            success: true,
            duplicated:
                response.data.data.duplicated === false,
        };
    } catch (error) {
        console.error('이메일 중복 검사 오류:', error);
        const axiosError = error as ErrorResponse;
        // 백엔드에서 오는 상세한 오류 메시지 사용
        if (
            axiosError.response?.data?.data &&
            axiosError.response.data.data.length > 0
        ) {
            const emailError =
                axiosError.response.data.data.find(
                    (err) => err.field === 'email'
                );
            if (emailError) {
                return {
                    success: false,
                    message: emailError.message,
                };
            }
        }
        // 일반적인 오류 메시지도 UI에 표시
        return {
            success: false,
            message:
                axiosError.response?.data?.message ||
                '이메일 확인 중 오류가 발생했습니다.',
        };
    }
};

// 회원가입 요청을 처리하는 로직
export const signUp = async (userData: unknown): Promise<unknown> => {
    try {
        const response = await apiClient.post(
            '/public/users/signup',
            userData
        );

        return response.data;
    } catch (error) {
        console.error('회원가입 오류:', error);
        const axiosError = error as ErrorResponse;
        throw new Error(
            axiosError.response?.data?.message ||
                '회원가입에 실패했습니다.'
        );
    }
};

interface SocialLoginErrorResponse {
    response?: {
        data?: {
            code?: string;
            data?: unknown;
        };
    };
}

// 사용자 소셜 로그인 요청 로직
export const loginWithProvider = async (
    provider: string,
    authorizationCode: string,
    setAuth: (authData: AuthData) => void,
    navigate: NavigateFunction
): Promise<void> => {
    try {
        const response = await apiClient.post<{
            data: {
                accessToken: string;
                refreshToken: string;
                authorizationId: string;
                scope: 'USER' | 'MANAGER' | 'APP';
            };
        }>(
            '/public/users/login-social',
            {
                provider,
                authorizationCode,
                platformType: 'WEB',
            }
        );

        const {
            accessToken,
            refreshToken,
            authorizationId,
            scope,
        } = response.data.data;
        setAuth({
            accessToken,
            refreshToken,
            authorizationId,
            scope: scope as 'USER' | 'MANAGER' | 'APP',
        });
        // scope에 따라 적절한 페이지로 리다이렉트
        if (scope === 'APP' || scope === 'USER') {
            navigate('/job-lookup-map');
        } else if (scope === 'MANAGER') {
            navigate('/main');
        }
    } catch (error) {
        console.error('백엔드로 code 전송 실패:', error);
        const axiosError = error as SocialLoginErrorResponse;
        const data = axiosError.response?.data || {};

        type ErrorHandler = () => void;
        const errorHandlers: Record<string, ErrorHandler> = {
            A002: () => {
                alert('매니저 이용자가 아닙니다.');
                navigate('/login');
            },
            A003: () => {
                alert('회원가입을 진행해주세요.');
                navigate('/phoneauth', {
                    state: { ...(data.data || {}) },
                });
            },
            A004: () => {
                alert(
                    '이미 다른 소셜 계정으로 가입된 이메일입니다. 해당 계정으로 로그인해 주세요.'
                );
                navigate('/login');
            },
            A007: () => {
                alert(
                    '소셜 로그인 인증이 만료되었습니다. 다시 시도해 주세요.'
                );
                navigate('/login');
            },
            B011: () => {
                alert('일반 사용자 가입을 진행해주세요.');
                navigate('/login');
            },
            default: () => {
                alert('네트워크 오류가 발생했습니다.');
                navigate('/error');
            },
        };

        (
            errorHandlers[data.code || ''] ||
            errorHandlers.default
        )();
    }
};

interface LoginData {
    email: string;
    password: string;
}

interface LoginError extends Error {
    data?: unknown;
}

// ID/PW 로그인 요청을 처리하는 로직
export const loginIDPW = async (
    userData: LoginData,
    setAuth: (authData: AuthData) => void,
    navigate: NavigateFunction
): Promise<void> => {
    try {
        const response = await apiClient.post<{
            data: {
                accessToken: string;
                refreshToken: string;
                authorizationId: string;
                scope: 'USER' | 'MANAGER' | 'APP';
            };
        }>(
            '/public/users/login',
            userData
        );

        const {
            accessToken,
            refreshToken,
            authorizationId,
            scope,
        } = response.data.data;

        // 토큰/인증 정보 상태에 저장
        setAuth({
            accessToken,
            refreshToken,
            authorizationId,
            scope: scope as 'USER' | 'MANAGER' | 'APP',
        });

        // scope에 따라 적절한 페이지로 리다이렉트
        if (scope === 'APP' || scope === 'USER') {
            navigate('/job-lookup-map');
        } else if (scope === 'MANAGER') {
            navigate('/main');
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        const axiosError = error as ErrorResponse;
        // 실패 시 에러 메시지 처리
        const err = new Error(
            axiosError.response?.data?.message ||
                '로그인에 실패했습니다.'
        ) as LoginError;
        err.data = axiosError.response?.data;
        throw err;
    }
};

// IDPW 회원가입 세션 생성 로직
export const createSignupSession = async (phone: string): Promise<string> => {
    try {
        // 하이픈 제거
        const phoneWithoutHyphen = phone.replace(/-/g, '');

        const response = await apiClient.post<{
            data: { signupSessionId: string };
        }>(
            '/public/users/signup-session',
            {
                contact: phoneWithoutHyphen,
            }
        );

        return response.data.data.signupSessionId;
    } catch (error) {
        console.error('회원가입 세션 생성 중 오류:', error);
        const axiosError = error as ErrorResponse;
        throw new Error(
            axiosError.response?.data?.message ||
                '회원가입 세션 생성 중 오류가 발생했습니다.'
        );
    }
};

// 로그아웃 처리 로직
export const logout = async (scope: string): Promise<unknown> => {
    const lowerScope = scope.toLowerCase();

    try {
        const response = await apiClient.post(
            `/${lowerScope}/auth/logout`
        );

        return response.data;
    } catch (error) {
        console.error('로그아웃 오류:', error);
        // 에러가 발생해도 로컬 상태는 로그아웃 처리
        throw error;
    }
};

// 아이디 찾기 - 휴대폰 인증 후 아이디 조회
export const findUserIdByPhone = async (phoneNumber: string): Promise<string> => {
    try {
        const response = await apiClient.post<{
            data: { maskedEmail: string };
        }>(
            '/public/users/find-email',
            {
                contact: phoneNumber,
            }
        );

        return response.data.data.maskedEmail; // 마스킹된 이메일 반환
    } catch (error) {
        console.error('아이디 찾기 오류:', error);
        const axiosError = error as ErrorResponse;
        throw new Error(
            axiosError.response?.data?.message ||
                '아이디 찾기에 실패했습니다.'
        );
    }
};

// 비밀번호 재설정 세션 생성
export const createPasswordResetSession = async (
    email: string,
    phoneNumber: string
): Promise<string> => {
    try {
        const response = await apiClient.post<{
            data: { sessionId: string };
        }>(
            '/public/users/password-reset/session',
            {
                email,
                contact: phoneNumber,
            }
        );

        return response.data.data.sessionId; // 세션 ID 반환
    } catch (error) {
        console.error(
            '비밀번호 재설정 세션 생성 오류:',
            error
        );
        const axiosError = error as ErrorResponse;
        throw new Error(
            axiosError.response?.data?.message ||
                '비밀번호 재설정 세션 생성에 실패했습니다.'
        );
    }
};

// 비밀번호 재설정
export const resetPassword = async (
    sessionId: string,
    newPassword: string
): Promise<unknown> => {
    try {
        const response = await apiClient.post(
            '/public/users/password-reset',
            {
                sessionId,
                newPassword,
            }
        );

        return response.data.data;
    } catch (error) {
        console.error('비밀번호 재설정 오류:', error);
        const axiosError = error as ErrorResponse;
        throw new Error(
            axiosError.response?.data?.message ||
                '비밀번호 재설정에 실패했습니다.'
        );
    }
};

// refreshAccessToken 함수는 src/services/refreshToken.ts로 분리됨

