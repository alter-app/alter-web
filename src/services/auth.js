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
export function initializeRecaptcha(
    containerId = 'recaptcha-container',
    onVerified
) {
    // 이미 인스턴스가 존재하면 렌더링하지 않고 기존 인스턴스 반환 (중복 렌더링 방지)
    if (window.recaptchaVerifier) {
        return window.recaptchaVerifier;
    }

    // DOM 요소 확인 및 정리
    const containerElement = document.getElementById(containerId);
    if (containerElement) {
        // 이미 reCAPTCHA가 렌더링되어 있는지 확인 (iframe이나 reCAPTCHA 관련 요소가 있는지 체크)
        const hasRecaptchaElements = 
            containerElement.querySelector('iframe[src*="recaptcha"]') ||
            containerElement.querySelector('.grecaptcha-badge') ||
            containerElement.hasAttribute('data-recaptcha-id');
        
        if (hasRecaptchaElements) {
            // 이미 렌더링된 reCAPTCHA가 있으면 요소를 비움
            containerElement.innerHTML = '';
            console.warn('기존 reCAPTCHA 요소를 정리했습니다.');
        }
    }

    try {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            containerId,
            {
                size: 'invisible',
                callback: (response) => {
                    if (onVerified) onVerified(response);
                },
                'expired-callback': () => {
                    // 만료 시 위젯 리셋 (삭제가 아님)
                    if (window.recaptchaVerifier) {
                        window.recaptchaVerifier.reset();
                    }
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
                    }
                },
            }
        );
        
        // render()는 Promise를 반환하므로 await 처리
        const renderPromise = window.recaptchaVerifier.render();
        
        // render()가 Promise를 반환하는 경우 에러 처리
        if (renderPromise && typeof renderPromise.catch === 'function') {
            renderPromise.catch((error) => {
                console.error('reCAPTCHA render failed:', error);
                
                // "already been rendered" 에러인 경우 특별 처리
                if (error?.message?.includes('already been rendered')) {
                    console.warn('reCAPTCHA가 이미 렌더링되어 있습니다. 기존 인스턴스를 재사용합니다.');
                    // DOM 요소를 다시 정리하고 재시도하지 않음 (기존 인스턴스 사용)
                    if (containerElement) {
                        containerElement.innerHTML = '';
                    }
                    // 인스턴스는 유지하되, 다음 호출 시 재사용될 수 있도록 함
                    return;
                }
                
                // 401 Unauthorized 에러인 경우 명확한 메시지
                if (error?.message?.includes('401') || error?.code === 401) {
                    console.error(
                        'reCAPTCHA 401 에러: Firebase 콘솔에서 현재 도메인(로컬호스트 포함)이 승인되었는지 확인하세요.'
                    );
                }
                // 실패한 인스턴스 정리
                if (window.recaptchaVerifier) {
                    try {
                        window.recaptchaVerifier.clear();
                    } catch (e) {
                        // 무시
                    }
                    window.recaptchaVerifier = null;
                }
            });
        }
    } catch (error) {
        // "already been rendered" 에러인 경우 특별 처리
        if (error?.message?.includes('already been rendered')) {
            console.warn('reCAPTCHA가 이미 렌더링되어 있습니다. DOM 요소를 정리합니다.');
            if (containerElement) {
                containerElement.innerHTML = '';
            }
            // 인스턴스를 정리하고 null 반환하여 재시도 가능하도록 함
            window.recaptchaVerifier = null;
            return null;
        }
        
        // 이미 렌더링 되었다면 무시하거나 기존 것 반환
        console.warn('Recaptcha initialization error:', error);
        // 에러 발생 시 인스턴스 정리
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (e) {
                // 무시
            }
            window.recaptchaVerifier = null;
        }
    }

    return window.recaptchaVerifier;
}

// reCAPTCHA 정리 (완전 삭제 시에만 사용)
export function clearRecaptcha(containerId = 'recaptcha-container') {
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.clear();
        } catch (e) {
            console.error(e);
        }
        window.recaptchaVerifier = null;
    }
    
    // DOM 요소도 정리
    const containerElement = document.getElementById(containerId);
    if (containerElement) {
        containerElement.innerHTML = '';
    }
}

// reCAPTCHA 리셋 (실패 후 재시도 시 사용)
export function resetRecaptcha() {
    if (window.recaptchaVerifier) {
        try {
            window.recaptchaVerifier.reset(); // clear() 대신 reset() 사용 권장
        } catch (error) {
            console.error('Error resetting recaptcha:', error);
        }
    }
}

// reCAPTCHA 인증번호 전송
export async function sendPhoneVerification(phoneNumber) {
    if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA가 초기화되지 않았습니다.');
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
        // 에러 발생 시 여기서 reset 하지 않고, UI 컴포넌트에서 처리하도록 에러만 던짐
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
                    return 'reCAPTCHA 인증 실패: Firebase 콘솔에서 도메인 설정을 확인하세요.';
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
