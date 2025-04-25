import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebase.config";

// reCAPTCHA 초기화
export function initializeRecaptcha(
    containerId = "recaptcha-container",
    onVerified
) {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            containerId,
            {
                size: "normal",
                callback: () => {
                    if (onVerified) onVerified();
                },
                "expired-callback": () => {
                    if (window.recaptchaVerifier) {
                        window.recaptchaVerifier.clear();
                        delete window.recaptchaVerifier;
                    }
                    alert(
                        "reCAPTCHA가 만료되었습니다. 다시 시도해주세요."
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
    const verifier = window.recaptchaVerifier;
    if (!verifier)
        throw new Error(
            "reCAPTCHA가 초기화되지 않았습니다."
        );
    try {
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
        case "auth/invalid-phone-number":
            return "잘못된 전화번호 형식입니다.";
        case "auth/too-many-requests":
            return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
        case "auth/code-expired":
            return "인증번호가 만료되었습니다. 다시 요청해주세요.";
        case "auth/invalid-verification-code":
            return "잘못된 인증번호입니다.";
        default:
            return "인증 처리 중 오류가 발생했습니다.";
    }
}

// 닉네임 중복 검사 로직
export const checkNicknameDuplicate = async (nickname) => {
    try {
        const response = await fetch(
            "/api/public/users/exists/nickname",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nickname }),
            }
        );

        if (!response.ok) {
            throw new Error("서버 응답 오류");
        }

        const data = await response.json();
        return data.data.duplicated === false;
    } catch (error) {
        console.error("닉네임 중복 검사 오류:", error);
        throw new Error(
            "닉네임 중복 검사 중 오류가 발생했습니다."
        );
    }
};

// 회원가입 요청을 처리하는 로직
export const signUp = async (userData) => {
    try {
        const response = await fetch(
            "/api/public/users/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                    "회원가입에 실패했습니다."
            );
        }

        return await response.json();
    } catch (error) {
        console.error("회원가입 오류:", error);
        throw error;
    }
};
