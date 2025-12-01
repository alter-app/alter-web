import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase.config';
import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

// reCAPTCHA 초기화
export async function initializeRecaptcha(
    containerId = 'recaptcha-container',
    onVerified
) {
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
                callback: (response) => {
                    if (onVerified) onVerified(response);
                },
                'expired-callback': () => {
                    resetRecaptcha(); // 만료 시 리셋
                    alert('reCAPTCHA가 만료되었습니다. 다시 시도해주세요.');
                },
                'error-callback': (error) => {
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
export function clearRecaptcha(containerId = 'recaptcha-container') {
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
export function resetRecaptcha() {
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
export async function sendPhoneVerification(phoneNumber) {
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
        const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            verifier
        );
        return confirmationResult.verificationId;
    } catch (error) {
        // 실패 시 리셋하여 다시 시도 가능하게 함
        resetRecaptcha();

        // 에러 메시지 매핑
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
export const checkNicknameDuplicate = async (nickname) => {
    try {
        const response = await fetch(
            `${backend}/public/users/exists/nickname`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        return data.data.duplicated === false;
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
        const response = await fetch(
            `${backend}/public/users/exists/email`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            // 백엔드에서 오는 상세한 오류 메시지 사용
            if (data.data && data.data.length > 0) {
                const emailError = data.data.find(
                    (error) => error.field === 'email'
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
                message: data.message || '서버 응답 오류',
            };
        }

        return {
            success: true,
            duplicated: data.data.duplicated === false,
        };
    } catch (error) {
        console.error('이메일 중복 검사 오류:', error);
        return {
            success: false,
            message: '이메일 확인 중 오류가 발생했습니다.',
        };
    }
};

// 회원가입 요청을 처리하는 로직
export const signUp = async (userData) => {
    try {
        const response = await fetch(
            `${backend}/public/users/signup`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }
        );

        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({}));

            throw new Error(
                errorData.message ||
                    '회원가입에 실패했습니다.'
            );
        }

        return await response.json();
    } catch (error) {
        console.error('회원가입 오류:', error);
        throw error;
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
        const response = await fetch(
            `${backend}/public/users/login-social`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider,
                    authorizationCode,
                    platformType: 'WEB',
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            const {
                accessToken,
                refreshToken,
                authorizationId,
                scope,
            } = data.data;
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
        }

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
                alert('알 수 없는 오류가 발생했습니다.');
                navigate('/error');
            },
        };

        (
            errorHandlers[data.code] ||
            errorHandlers.default
        )();
    } catch (error) {
        console.error('백엔드로 code 전송 실패:', error);
        alert('네트워크 오류가 발생했습니다.');
        navigate('/error');
    }
};

// ID/PW 로그인 요청을 처리하는 로직
export const loginIDPW = async (
    userData,
    setAuth,
    navigate
) => {
    try {
        const response = await fetch(
            `${backend}/public/users/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }
        );

        const data = await response.json();

        if (response.ok) {
            const {
                accessToken,
                refreshToken,
                authorizationId,
                scope,
            } = data.data;

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
        }

        // 실패 시 에러 메시지 처리
        const errorMessage =
            data.message || '로그인에 실패했습니다.';
        alert(errorMessage);
        throw new Error(errorMessage);
    } catch (error) {
        console.error('로그인 오류:', error);
        alert('네트워크 오류가 발생했습니다.');
        navigate('/error');
    }
};

// IDPW 회원가입 세션 생성 로직
export const createSignupSession = async (phone) => {
    try {
        const response = await fetch(
            `${backend}/public/users/signup-session`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact: phone }),
            }
        );

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data.data.signupSessionId;
    } catch (error) {
        console.error('회원가입 세션 생성 중 오류:', error);
        throw new Error(
            '회원가입 세션 생성 중 오류가 발생했습니다.'
        );
    }
};

// 로그아웃 처리 로직
export const logout = async (scope) => {
    const backend = import.meta.env.VITE_API_URL;
    const accessToken = useAuthStore.getState().accessToken;

    const lowerScope = scope.toLowerCase();

    try {
        const response = await fetch(
            `${backend}/${lowerScope}/auth/logout`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('로그아웃에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('로그아웃 오류:', error);
        // 에러가 발생해도 로컬 상태는 로그아웃 처리
        throw error;
    }
};

// 아이디 찾기 - 휴대폰 인증 후 아이디 조회
export const findUserIdByPhone = async (phoneNumber) => {
    try {
        const response = await fetch(
            `${backend}/public/users/find-email`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact: phoneNumber }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || '아이디 찾기에 실패했습니다.'
            );
        }

        return data.data.maskedEmail; // 마스킹된 이메일 반환
    } catch (error) {
        console.error('아이디 찾기 오류:', error);
        throw error;
    }
};

// 비밀번호 재설정 세션 생성
export const createPasswordResetSession = async (email, phoneNumber) => {
    try {
        const response = await fetch(
            `${backend}/public/users/password-reset/session`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    contact: phoneNumber,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || '비밀번호 재설정 세션 생성에 실패했습니다.'
            );
        }

        return data.data.sessionId; // 세션 ID 반환
    } catch (error) {
        console.error('비밀번호 재설정 세션 생성 오류:', error);
        throw error;
    }
};

// 비밀번호 재설정
export const resetPassword = async (sessionId, newPassword) => {
    try {
        const response = await fetch(
            `${backend}/public/users/password-reset`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    newPassword,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || '비밀번호 재설정에 실패했습니다.'
            );
        }

        return data.data;
    } catch (error) {
        console.error('비밀번호 재설정 오류:', error);
        throw error;
    }
};
