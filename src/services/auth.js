import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase.config';

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

        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        return data.data.duplicated === false;
    } catch (error) {
        console.error('닉네임 중복 검사 오류:', error);
        throw new Error(
            '닉네임 중복 검사 중 오류가 발생했습니다.'
        );
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
    navigate,
    state // "manager" or "user"
) => {
    try {
        const response = await fetch(
            `${backend}/public/${state}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider,
                    authorizationCode,
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
            return navigate('/job-lookup-map');
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
