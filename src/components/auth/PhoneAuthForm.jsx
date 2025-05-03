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
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [phoneError, setPhoneError] = useState(""); // 전화번호 에러 메시지 상태
    const [codeError, setCodeError] = useState(""); // 인증 코드 에러 메시지 상태

    useEffect(() => {
        initializeRecaptcha("recaptcha-container", () => {
            console.log("reCAPTCHA verified");
        });
        return clearRecaptcha;
    }, []);

    const isValidPhoneNumber = (number) =>
        /^\+82\d{9,10}$/.test(number);

    const handleSendCode = async (e) => {
        e.preventDefault();
        const formattedE164 =
            formatPhoneNumberToE164(phoneNumber);

        if (!isValidPhoneNumber(formattedE164)) {
            setPhoneError(
                "올바른 형식의 휴대폰 번호를 입력하세요."
            );
            return;
        }

        setLoading(true);
        setPhoneError(""); // 에러 메시지 초기화
        try {
            const vId = await sendPhoneVerification(
                formattedE164
            );
            setVerificationId(vId);
            setIsCodeSent(true);
        } catch (error) {
            clearRecaptcha();
            initializeRecaptcha("recaptcha-container");
            setPhoneError(
                error.message || "인증번호 전송 실패"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (verificationCode.length !== 6) {
            setCodeError("6자리 인증번호를 입력하세요.");
            return;
        }
        setLoading(true);
        setCodeError(""); // 에러 메시지 초기화
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
            setCodeError(error.message || "");
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
                            onChange={(e) => {
                                setPhoneNumber(
                                    formatPhoneNumber(
                                        e.target.value
                                    )
                                );
                                setPhoneError(""); // 입력 변경 시 에러 메시지 초기화
                            }}
                            maxLength={13}
                            required
                            disabled={isCodeSent}
                            borderColor={
                                phoneError
                                    ? "1px solid #DC0000"
                                    : undefined
                            }
                        />
                        <AuthButton
                            type="button"
                            onClick={handleSendCode}
                            disabled={loading}
                            $font_size="18px"
                            width="129px"
                        >
                            {loading
                                ? "인증번호 재전송"
                                : isCodeSent
                                ? "인증번호 재전송"
                                : "인증번호 전송"}
                        </AuthButton>
                    </Row>

                    <AuthInput
                        name="verificationCode"
                        type="text"
                        placeholder="인증번호 입력"
                        value={verificationCode}
                        onChange={(e) => {
                            setVerificationCode(
                                e.target.value
                            );
                            setCodeError(""); // 입력 변경 시 에러 메시지 초기화
                        }}
                        maxLength={6}
                        required
                        disabled={
                            loading || !verificationId
                        }
                        borderColor={
                            codeError
                                ? "1px solid #DC0000"
                                : undefined
                        }
                    />
                </SInputStack>
                <ErrorMessage>
                    {codeError || phoneError || "\u00A0"}
                </ErrorMessage>
                <InfoGuide>
                    인증 확인이 안눌린다면 번호를 다시
                    확인해 주세요.
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
    margin-top: 152px;
    margin-bottom: 12px;
`;

const SInputStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ErrorMessage = styled.div`
    color: #dc0000;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    margin-top: 4px;
    margin-left: 8px;
`;
