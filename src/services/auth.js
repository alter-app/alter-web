import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase.config';
import useAuthStore from '../store/authStore';
import apiClient from '../utils/apiClient';
import axios from 'axios';

const backend = import.meta.env.VITE_API_URL;

// reCAPTCHA 초기화
export function initializeRecaptcha(
    containerId = 'recaptcha-container',
    onVerified
) {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            containerId,
            {
                size: 'invisible',
                callback: () => {
                    if (onVerified) onVerified();
                },
                'expired-callback': () => {
                    if (window.recaptchaVerifier) {
                        window.recaptchaVerifier.clear();
                        delete window.recaptchaVerifier;
                    }
                    alert(
                        'reCAPTCHA가 만료되었습니다. 다시 시도해주세요.'
                    );
                },
            }
        );
        window.recaptchaVerifier.render();
    }
    return window.recaptchaVerifier;
}

// reCAPTCHA 정리
export function clearRecaptcha() {
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
    }
}

// reCAPTCHA 인증번호 전송
export async function sendPhoneVerification(phoneNumber) {
    if (!window.recaptchaVerifier)
        throw new Error(
            'reCAPTCHA가 초기화되지 않았습니다.'
        );
    try {
        const verifier = window.recaptchaVerifier;
        const confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phoneNumber,
                verifier
            );
        return confirmationResult.verificationId;
    } catch (error) {
        throw new Error(getFirebaseErrorMsg(error.code));
    }
}

// reCAPTCHA 인증번호 검증
export async function verifyPhoneCode(
    verificationId,
    code
) {
    try {
        const credential = PhoneAuthProvider.credential(
            verificationId,
            code
        );
        const result = await signInWithCredential(
            auth,
            credential
        );
        return result.user?.phoneNumber;
    } catch (error) {
        throw new Error(getFirebaseErrorMsg(error.code));
    }
}

// Firebase 에러 메시지 매핑
function getFirebaseErrorMsg(code) {
    switch (code) {
        case 'auth/invalid-phone-number':
            return '잘못된 전화번호 형식입니다.';
        case 'auth/too-many-requests':
            return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        case 'auth/code-expired':
            return '인증번호가 만료되었습니다. 다시 요청해주세요.';
        case 'auth/invalid-verification-code':
            return '잘못된 인증번호입니다.';
        default:
            return '인증 처리 중 오류가 발생했습니다.';
    }
}

// 닉네임 중복 검사 로직
export const checkNicknameDuplicate = async (nickname) => {
    try {
        const response = await apiClient.post(
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

// 이메일 중복 검사 로직
export const checkEmailDuplicate = async (email) => {
    try {
        const response = await apiClient.post(
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
        // 백엔드에서 오는 상세한 오류 메시지 사용
        if (
            error.response?.data?.data &&
            error.response.data.data.length > 0
        ) {
            const emailError =
                error.response.data.data.find(
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
                error.response?.data?.message ||
                '이메일 확인 중 오류가 발생했습니다.',
        };
    }
};

// 회원가입 요청을 처리하는 로직
export const signUp = async (userData) => {
    try {
        const response = await apiClient.post(
            '/public/users/signup',
            userData
        );

        return response.data;
    } catch (error) {
        console.error('회원가입 오류:', error);
        throw new Error(
            error.response?.data?.message ||
                '회원가입에 실패했습니다.'
        );
    }
};

// 사용자 소셜 로그인 요청 로직
export const loginWithProvider = async (
    provider,
    authorizationCode,
    setAuth,
    navigate
) => {
    try {
        const response = await apiClient.post(
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
            scope,
        });
        // scope에 따라 적절한 페이지로 리다이렉트
        if (scope === 'APP') {
            return navigate('/job-lookup-map');
        } else if (scope === 'MANAGER') {
            return navigate('/main');
        }
    } catch (error) {
        console.error('백엔드로 code 전송 실패:', error);
        const data = error.response?.data || {};

        const errorHandlers = {
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
            errorHandlers[data.code] ||
            errorHandlers.default
        )();
    }
};

// ID/PW 로그인 요청을 처리하는 로직
export const loginIDPW = async (
    userData,
    setAuth,
    navigate
) => {
    try {
        const response = await apiClient.post(
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
            scope,
        });

        // scope에 따라 적절한 페이지로 리다이렉트
        if (scope === 'APP') {
            return navigate('/job-lookup-map');
        } else if (scope === 'MANAGER') {
            return navigate('/main');
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        // 실패 시 에러 메시지 처리
        const err = new Error(
            error.response?.data?.message ||
                '로그인에 실패했습니다.'
        );
        err.data = error.response?.data;
        throw err;
    }
};

// IDPW 회원가입 세션 생성 로직
export const createSignupSession = async (phone) => {
    try {
        // 하이픈 제거
        const phoneWithoutHyphen = phone.replace(/-/g, '');

        const response = await apiClient.post(
            '/public/users/signup-session',
            {
                contact: phoneWithoutHyphen,
            }
        );

        return response.data.data.signupSessionId;
    } catch (error) {
        console.error('회원가입 세션 생성 중 오류:', error);
        throw new Error(
            error.response?.data?.message ||
                '회원가입 세션 생성 중 오류가 발생했습니다.'
        );
    }
};

// 로그아웃 처리 로직
export const logout = async (scope) => {
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
export const findUserIdByPhone = async (phoneNumber) => {
    try {
        const response = await apiClient.post(
            '/public/users/find-email',
            {
                contact: phoneNumber,
            }
        );

        return response.data.data.maskedEmail; // 마스킹된 이메일 반환
    } catch (error) {
        console.error('아이디 찾기 오류:', error);
        throw new Error(
            error.response?.data?.message ||
                '아이디 찾기에 실패했습니다.'
        );
    }
};

// 비밀번호 재설정 세션 생성
export const createPasswordResetSession = async (
    email,
    phoneNumber
) => {
    try {
        const response = await apiClient.post(
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
        throw new Error(
            error.response?.data?.message ||
                '비밀번호 재설정 세션 생성에 실패했습니다.'
        );
    }
};

// 비밀번호 재설정
export const resetPassword = async (
    sessionId,
    newPassword
) => {
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
        throw new Error(
            error.response?.data?.message ||
                '비밀번호 재설정에 실패했습니다.'
        );
    }
};

// 토큰 재발급 함수
// 주의: 이 함수는 apiClient를 사용하지 않고 직접 axios 사용 (무한 루프 방지)
export const refreshAccessToken = async () => {
    const { refreshToken, scope } = useAuthStore.getState();

    if (!refreshToken) {
        throw new Error('RefreshToken이 없습니다.');
    }

    const basePath =
        scope === 'MANAGER' ? 'manager' : 'app';

    try {
        // apiClient를 사용하지 않고 직접 axios 사용 (interceptor 우회)
        const response = await axios.post(
            `${backend}/${basePath}/auth/token`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );

        const {
            accessToken,
            refreshToken: newRefreshToken,
            authorizationId,
            scope: newScope,
        } = response.data.data;

        useAuthStore.getState().setAuth({
            accessToken,
            refreshToken: newRefreshToken,
            authorizationId,
            scope: newScope,
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        // logout은 apiClient에서 모달 확인 후 처리하도록 함
        throw error;
    }
};
