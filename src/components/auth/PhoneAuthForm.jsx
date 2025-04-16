import { useEffect, useState } from "react";
import {
    initializeRecaptcha,
    clearRecaptcha,
    sendPhoneVerification,
    verifyPhoneCode,
} from "../../services/auth";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

const PhoneAuthForm = () => {
    const [verificationId, setVerificationId] =
        useState("");
    const [loading, setLoading] = useState(false);
    const [recaptchaVerified, setRecaptchaVerified] =
        useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] =
        useState("");

    // reCAPTCHA 초기화 및 검증 상태 관리
    useEffect(() => {
        initializeRecaptcha("recaptcha-container", () =>
            setRecaptchaVerified(true)
        );
        return () => clearRecaptcha();
    }, []);

    // 전화번호 형식 검증 함수
    const isValidPhoneNumber = (number) =>
        /^\+82\d{9,10}$/.test(number);

    // 인증번호 전송
    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!recaptchaVerified) {
            alert("reCAPTCHA 검증이 필요합니다.");
            return;
        }
        const formattedNumber = phoneNumber.replace(
            /[-\s]/g,
            ""
        );
        if (!isValidPhoneNumber(formattedNumber)) {
            alert(
                "국가코드(+82)와 함께 올바른 전화번호를 입력하세요. 예: +821012345678"
            );
            return;
        }
        setLoading(true);
        try {
            const vId = await sendPhoneVerification(
                formattedNumber
            );
            setVerificationId(vId);
            alert("인증번호가 전송되었습니다.");
        } catch (error) {
            clearRecaptcha();
            initializeRecaptcha("recaptcha-container", () =>
                setRecaptchaVerified(true)
            );
            alert(error.message || "인증번호 전송 실패");
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 검증
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (
            !verificationCode ||
            verificationCode.length !== 6
        ) {
            alert("6자리 인증번호를 입력하세요.");
            return;
        }
        setLoading(true);
        try {
            const phone = await verifyPhoneCode(
                verificationId,
                verificationCode
            );
            alert(`인증 성공! 인증된 번호: ${phone}`);
            setVerificationId("");
            setVerificationCode("");
            setPhoneNumber("");
        } catch (error) {
            alert("인증 실패: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div id="recaptcha-container"></div>

            <div>
                <AuthInput
                    name="phoneNumber"
                    placeholder="전화번호 (+821012345678)"
                    value={phoneNumber}
                    onChange={(e) =>
                        setPhoneNumber(e.target.value)
                    }
                    pattern="\+82\d{9,10}"
                    title="+821012345678 형식으로 입력"
                    required
                    disabled={loading}
                />
                <AuthButton
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading || !recaptchaVerified}
                >
                    {loading
                        ? "전송 중..."
                        : "인증번호 전송"}
                </AuthButton>
            </div>

            <div>
                <AuthInput
                    name="verificationCode"
                    placeholder="인증번호 6자리"
                    value={verificationCode}
                    onChange={(e) =>
                        setVerificationCode(e.target.value)
                    }
                    maxLength={6}
                    required
                    disabled={loading || !verificationId}
                />
                <AuthButton
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={loading || !verificationId}
                >
                    {loading ? "확인 중..." : "인증하기"}
                </AuthButton>
            </div>
        </div>
    );
};

export default PhoneAuthForm;
