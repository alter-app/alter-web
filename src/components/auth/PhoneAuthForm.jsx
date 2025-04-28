import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    initializeRecaptcha,
    clearRecaptcha,
    sendPhoneVerification,
    verifyPhoneCode,
} from "../../services/auth";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import styled from "styled-components";
import {
    formatPhoneNumber,
    formatPhoneNumberToE164,
} from "../../utils/phoneUtils";

const PhoneAuthForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [verificationId, setVerificationId] =
        useState("");
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] =
        useState("");
    const [isCodeSent, setIsCodeSent] = useState(false); // 코드 전송 여부 상태만 유지

    // reCAPTCHA 초기화 - 이제 recaptchaVerified 상태가 필요 없음
    useEffect(() => {
        initializeRecaptcha("recaptcha-container", () => {
            // 인증 성공 시 콜백은 유지하되 상태 업데이트는 필요 없음
            console.log("reCAPTCHA verified");
        });
        return clearRecaptcha;
    }, []);

    // 전화번호 형식 검증
    const isValidPhoneNumber = (number) =>
        /^\+82\d{9,10}$/.test(number);

    // 인증번호 전송
    const handleSendCode = async (e) => {
        e.preventDefault();
        // 1. 현재 화면에 표시된 phoneNumber 상태를 E.164 형식으로 변환 시도
        const formattedE164 =
            formatPhoneNumberToE164(phoneNumber);

        // 2. 변환된 E.164 형식이 유효한지 검사
        if (!isValidPhoneNumber(formattedE164)) {
            // 사용자에게는 익숙한 형식으로 안내하는 것이 더 좋을 수 있습니다.
            return alert(
                "올바른 형식의 휴대폰 번호를 입력하세요."
            );
        }

        setLoading(true);
        try {
            // reCAPTCHA 확인은 sendPhoneVerification 내부에서 처리됨
            const vId = await sendPhoneVerification(
                formattedE164
            );
            setVerificationId(vId);
            setIsCodeSent(true); // 코드 전송 성공 상태로 변경
            alert("인증번호가 전송되었습니다.");
        } catch (error) {
            clearRecaptcha();
            initializeRecaptcha("recaptcha-container");
            alert(error.message || "인증번호 전송 실패");
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 검증 (변경 없음)
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (verificationCode.length !== 6) {
            return alert("6자리 인증번호를 입력하세요.");
        }
        setLoading(true);
        try {
            await verifyPhoneCode(
                verificationId,
                verificationCode
            );
            navigate("/signup", {
                state: {
                    phone: phoneNumber,
                    ...location.state,
                },
            });
        } catch (error) {
            alert("인증 실패: " + (error.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <div id="recaptcha-container"></div>
                <SInputStack>
                    <Row>
                        <AuthInput
                            width="283px"
                            name="phoneNumber"
                            type="tel"
                            placeholder="010-1234-5678"
                            value={phoneNumber}
                            onChange={(e) =>
                                setPhoneNumber(
                                    formatPhoneNumber(
                                        e.target.value
                                    )
                                )
                            }
                            maxLength={13}
                            required
                            disabled={isCodeSent}
                        />
                        <AuthButton
                            type="button"
                            onClick={handleSendCode}
                            disabled={loading}
                            $font_size="18px"
                            width="129px"
                        >
                            {loading
                                ? "전송 중..."
                                : isCodeSent // 코드가 한 번이라도 보내졌다면
                                ? "인증번호 재전송" // 재전송 텍스트 표시
                                : "인증번호 전송"}
                        </AuthButton>
                    </Row>

                    <AuthInput
                        name="verificationCode"
                        type="text"
                        placeholder="인증번호 입력"
                        value={verificationCode}
                        onChange={(e) =>
                            setVerificationCode(
                                e.target.value
                            )
                        }
                        maxLength={6}
                        required
                        disabled={
                            loading || !verificationId
                        }
                    />
                </SInputStack>
                <InfoGuide>
                    인증 확인이 안눌린다면 번호를 다시 확인
                    해 주세요.
                </InfoGuide>
                <AuthButton
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={loading || !verificationId}
                >
                    인증 확인
                </AuthButton>
            </div>
        </div>
    );
};

export default PhoneAuthForm;

const Row = styled.div`
    display: flex;
    gap: 8px;
`;

const InfoGuide = styled.div`
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #767676;
    margin-top: 174px;
    margin-bottom: 12px;
`;

const SInputStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;
