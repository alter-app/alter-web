import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthInput from '../components/auth/AuthInput';
import {
    initializeRecaptcha,
    clearRecaptcha,
    sendPhoneVerification,
    verifyPhoneCode,
    createPasswordResetSession,
    resetPassword,
} from '../services/auth';
import {
    formatPhoneNumber,
    formatPhoneNumberToE164,
} from '../utils/phoneUtils';
import chevronLeftIcon from '../assets/icons/chevronLeft.svg';

const FindPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: 아이디 입력, 2: 휴대폰 인증, 3: 새 비밀번호 설정
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [codeError, setCodeError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] =
        useState('');

    useEffect(() => {
        if (step === 2) {
            initializeRecaptcha('recaptcha-container', () => {
                console.log('reCAPTCHA verified');
            });
            return clearRecaptcha;
        }
    }, [step]);

    const isValidPhoneNumber = (number) =>
        /^\+82\d{9,10}$/.test(number);

    const isValidPassword = (password) => {
        // 비밀번호 조건: 8~16자리, 영문, 숫자, 특수문자 조합
        const hasMinLength = password.length >= 8 && password.length <= 16;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasMinLength && hasLetter && hasNumber && hasSpecialChar;
    };

    const handleNextStep1 = () => {
        if (!email) {
            setEmailError('아이디를 입력해주세요.');
            return;
        }

        // 이메일 형식 기본 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        setEmailError('');
        setStep(2);
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        const formattedE164 =
            formatPhoneNumberToE164(phoneNumber);

        if (!isValidPhoneNumber(formattedE164)) {
            setPhoneError(
                '올바른 형식의 휴대폰 번호를 입력하세요.'
            );
            return;
        }

        setLoading(true);
        setPhoneError('');
        try {
            const vId = await sendPhoneVerification(
                formattedE164
            );
            setVerificationId(vId);
            setIsCodeSent(true);
        } catch (error) {
            clearRecaptcha();
            initializeRecaptcha('recaptcha-container');
            setPhoneError(
                error.message || '인증번호 전송 실패'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (verificationCode.length !== 6) {
            setCodeError('6자리 인증번호를 입력하세요.');
            return;
        }
        setLoading(true);
        setCodeError('');
        try {
            // 휴대폰 인증 확인
            await verifyPhoneCode(verificationId, verificationCode);
            
            // 인증 성공 후 비밀번호 재설정 세션 생성
            const contactNumber = phoneNumber.replace(/[^0-9]/g, '');
            const session = await createPasswordResetSession(
                email,
                contactNumber
            );
            setSessionId(session);
            setStep(3);
        } catch (error) {
            setCodeError(
                error.message || '인증번호가 올바르지 않습니다.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            setPasswordError('새 비밀번호를 입력해주세요.');
            return;
        }

        if (!isValidPassword(newPassword)) {
            setPasswordError(
                '비밀번호는 8~16자리이며 영문, 숫자, 특수문자를 조합해야 합니다.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!sessionId) {
            alert('세션이 만료되었습니다. 처음부터 다시 시도해주세요.');
            navigate('/find-password');
            return;
        }

        setLoading(true);
        setPasswordError('');
        setConfirmPasswordError('');
        try {
            await resetPassword(sessionId, newPassword);
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/login');
        } catch (error) {
            alert(error.message || '비밀번호 재설정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        if (step === 1) {
            navigate('/login');
        } else {
            setStep(step - 1);
        }
    };

    return (
        <Container>
            <BackButton onClick={handleGoBack}>
                <BackIcon src={chevronLeftIcon} alt='뒤로가기' />
            </BackButton>
            <RecaptchaContainer id='recaptcha-container'></RecaptchaContainer>

            {step === 1 ? (
                <ContentWrapper>
                    <Title>비밀번호 찾기</Title>
                    <Description>아이디를 입력해 주세요</Description>
                    <FormSection>
                        <EmailInput
                            type='email'
                            placeholder='아이디'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            $hasError={!!emailError}
                        />
                        {emailError && (
                            <ErrorMessage>{emailError}</ErrorMessage>
                        )}
                    </FormSection>
                    <NextButton
                        onClick={handleNextStep1}
                        disabled={loading || !email}
                        $isActive={email.endsWith('.com') && email.includes('@')}
                    >
                        다음
                    </NextButton>
                </ContentWrapper>
            ) : step === 2 ? (
                <ContentWrapper>
                    <Title>휴대폰 번호를 입력해 주세요!</Title>
                    <Description>
                        비밀번호를 찾기 위한 인증 번호를
                        <br />
                        휴대폰 문자로 발송해 드려요.
                    </Description>
                    <FormSection>
                        <InputRow>
                            <PhoneInput
                                type='tel'
                                placeholder='전화번호 11자리(-없이)'
                                value={phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ''
                                    );
                                    if (value.length <= 11) {
                                        setPhoneNumber(value);
                                        setPhoneError('');
                                    }
                                }}
                                maxLength={11}
                                disabled={isCodeSent}
                                $hasError={!!phoneError}
                            />
                            <SendButton
                                type='button'
                                onClick={handleSendCode}
                                disabled={
                                    loading ||
                                    !phoneNumber ||
                                    phoneNumber.length !== 11 ||
                                    isCodeSent
                                }
                            >
                                {loading
                                    ? '전송 중...'
                                    : isCodeSent
                                    ? '재전송'
                                    : '인증번호 전송'}
                            </SendButton>
                        </InputRow>
                        {phoneError && (
                            <ErrorMessage>{phoneError}</ErrorMessage>
                        )}

                        <CodeInput
                            type='text'
                            placeholder='인증번호 입력'
                            value={verificationCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ''
                                );
                                if (value.length <= 6) {
                                    setVerificationCode(value);
                                    setCodeError('');
                                }
                            }}
                            maxLength={6}
                            disabled={!isCodeSent}
                            $hasError={!!codeError}
                        />
                        {codeError && (
                            <ErrorMessage>{codeError}</ErrorMessage>
                        )}
                    </FormSection>
                    <DoneButton
                        onClick={handleVerifyCode}
                        disabled={
                            loading ||
                            !isCodeSent ||
                            verificationCode.length !== 6
                        }
                    >
                        완료
                    </DoneButton>
                </ContentWrapper>
            ) : (
                <ContentWrapper>
                    <Title>새로운 비밀번호를 입력해 주세요</Title>
                    <Description>
                        8~16자리 영문, 숫자, 특수문자를 조합하여 입력해주세요.
                    </Description>
                    <FormSection>
                        <PasswordInput
                            type='password'
                            placeholder='새 비밀번호'
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordError('');
                            }}
                            $hasError={!!passwordError}
                        />
                        {passwordError && (
                            <ErrorMessage>{passwordError}</ErrorMessage>
                        )}

                        <PasswordInput
                            type='password'
                            placeholder='비밀번호 확인'
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setConfirmPasswordError('');
                            }}
                            $hasError={!!confirmPasswordError}
                        />
                        {confirmPasswordError && (
                            <ErrorMessage>
                                {confirmPasswordError}
                            </ErrorMessage>
                        )}
                    </FormSection>
                    <DoneButton
                        onClick={handleResetPassword}
                        disabled={
                            loading ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword
                        }
                    >
                        완료
                    </DoneButton>
                </ContentWrapper>
            )}
        </Container>
    );
};

export default FindPasswordPage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    min-height: 100dvh;
    width: 100vw;
    max-width: 100vw;
    padding: 24px 20px;
    padding-bottom: 100px;
    box-sizing: border-box;
    background: #ffffff;
    position: relative;
    overflow-x: hidden;

    @media (max-width: 480px) {
        padding: 20px 16px;
        padding-bottom: 100px;
    }

    @media (max-width: 360px) {
        padding: 16px 12px;
        padding-bottom: 90px;
    }

    /* iOS Safari safe area */
    @supports (padding: max(0px)) {
        padding-left: max(20px, env(safe-area-inset-left));
        padding-right: max(
            20px,
            env(safe-area-inset-right)
        );
        padding-top: max(24px, env(safe-area-inset-top));
        padding-bottom: max(100px, calc(env(safe-area-inset-bottom) + 100px));
    }

    /* reCAPTCHA 푸터 숨기기 */
    .rc-anchor-normal-footer {
        display: none !important;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
    margin-top: 60px;

    @media (max-width: 480px) {
        margin-top: 50px;
        align-items: flex-start;
    }

    @media (max-width: 360px) {
        margin-top: 40px;
        align-items: flex-start;
    }
`;

const BackButton = styled.button`
    position: absolute;
    top: 24px;
    left: 20px;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    @media (max-width: 480px) {
        top: 20px;
        left: 16px;
    }

    @media (max-width: 360px) {
        top: 16px;
        left: 12px;
    }
`;

const BackIcon = styled.img`
    width: 30px;
    height: 30px;
    display: block;

    @media (max-width: 480px) {
        width: 28px;
        height: 28px;
    }

    @media (max-width: 360px) {
        width: 24px;
        height: 24px;
    }
`;

const RecaptchaContainer = styled.div`
    position: absolute;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
`;

const Title = styled.h1`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    color: #111111;
    text-align: left;
    margin-bottom: 8px;
    margin-top: 0;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 22px;
        line-height: 30px;
    }

    @media (max-width: 360px) {
        font-size: 20px;
        line-height: 28px;
    }
`;

const Description = styled.p`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 15px;
    line-height: 22px;
    color: #767676;
    text-align: left;
    margin-top: 0;
    margin-bottom: 32px;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 28px;
    }

    @media (max-width: 360px) {
        font-size: 13px;
        line-height: 19px;
        margin-bottom: 24px;
    }
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        gap: 14px;
    }

    @media (max-width: 360px) {
        gap: 12px;
    }
`;

const InputRow = styled.div`
    display: flex;
    gap: 8px;
    width: 100%;

    @media (max-width: 480px) {
        gap: 6px;
    }

    @media (max-width: 360px) {
        gap: 4px;
    }
`;

const EmailInput = styled.input`
    width: 100%;
    height: 56px;
    border: 1px solid
        ${({ $hasError }) => ($hasError ? '#DC0000' : '#e5e5e5')};
    border-radius: 12px;
    background-color: #f8f9fa;
    padding: 16px 20px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid
            ${({ $hasError }) => ($hasError ? '#DC0000' : '#2de283')};
        background-color: #ffffff;
        box-shadow: 0 0 0 3px
            ${({ $hasError }) =>
                $hasError
                    ? 'rgba(220, 0, 0, 0.1)'
                    : 'rgba(45, 226, 131, 0.1)'};
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 16px;
        padding: 14px 18px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 15px;
        padding: 12px 16px;
        border-radius: 8px;
    }
`;

const PhoneInput = styled.input`
    flex: 1;
    height: 56px;
    border: 1px solid
        ${({ $hasError }) => ($hasError ? '#DC0000' : '#e5e5e5')};
    border-radius: 12px;
    background-color: #f8f9fa;
    padding: 16px 20px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid
            ${({ $hasError }) => ($hasError ? '#DC0000' : '#2de283')};
        background-color: #ffffff;
        box-shadow: 0 0 0 3px
            ${({ $hasError }) =>
                $hasError
                    ? 'rgba(220, 0, 0, 0.1)'
                    : 'rgba(45, 226, 131, 0.1)'};
    }

    &:disabled {
        background-color: #f0f0f0;
        color: #999999;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 16px;
        padding: 14px 18px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 15px;
        padding: 12px 16px;
        border-radius: 8px;
    }
`;

const SendButton = styled.button`
    height: 56px;
    padding: 0 20px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    border-radius: 12px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #25c973;
    }

    &:disabled {
        background: #cbcbcb;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        height: 52px;
        padding: 0 16px;
        font-size: 13px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 8px;
    }
`;

const CodeInput = styled.input`
    width: 100%;
    height: 56px;
    border: 1px solid
        ${({ $hasError }) => ($hasError ? '#DC0000' : '#e5e5e5')};
    border-radius: 12px;
    background-color: #f8f9fa;
    padding: 16px 20px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid
            ${({ $hasError }) => ($hasError ? '#DC0000' : '#2de283')};
        background-color: #ffffff;
        box-shadow: 0 0 0 3px
            ${({ $hasError }) =>
                $hasError
                    ? 'rgba(220, 0, 0, 0.1)'
                    : 'rgba(45, 226, 131, 0.1)'};
    }

    &:disabled {
        background-color: #f0f0f0;
        color: #999999;
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 16px;
        padding: 14px 18px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 15px;
        padding: 12px 16px;
        border-radius: 8px;
    }
`;

const PasswordInput = styled.input`
    width: 100%;
    height: 56px;
    border: 1px solid
        ${({ $hasError }) => ($hasError ? '#DC0000' : '#e5e5e5')};
    border-radius: 12px;
    background-color: #f8f9fa;
    padding: 16px 20px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid
            ${({ $hasError }) => ($hasError ? '#DC0000' : '#2de283')};
        background-color: #ffffff;
        box-shadow: 0 0 0 3px
            ${({ $hasError }) =>
                $hasError
                    ? 'rgba(220, 0, 0, 0.1)'
                    : 'rgba(45, 226, 131, 0.1)'};
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 16px;
        padding: 14px 18px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 15px;
        padding: 12px 16px;
        border-radius: 8px;
    }
`;

const ErrorMessage = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #dc0000;
    margin-top: -8px;

    @media (max-width: 480px) {
        font-size: 11px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
    }
`;

const NextButton = styled.button`
    width: calc(100% - 40px);
    max-width: 400px;
    height: 48px;
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    border: none;
    background: ${({ $isActive }) => ($isActive ? '#2de283' : '#d6d3d1')};
    color: #ffffff;
    font-family: 'Pretendard Variable', 'Pretendard', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: ${({ $isActive }) =>
        $isActive
            ? '0 2px 8px rgba(45, 226, 131, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    z-index: 100;

    &:hover:not(:disabled) {
        background: ${({ $isActive }) => ($isActive ? '#25c973' : '#c4c1bf')};
        box-shadow: ${({ $isActive }) =>
            $isActive
                ? '0 4px 12px rgba(45, 226, 131, 0.4)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    }

    &:active:not(:disabled) {
        background: ${({ $isActive }) => ($isActive ? '#1fb865' : '#b3b0ae')};
        box-shadow: ${({ $isActive }) =>
            $isActive
                ? '0 2px 6px rgba(45, 226, 131, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    }

    &:disabled {
        background: #cbcbcb;
        cursor: not-allowed;
        box-shadow: none;
    }

    @media (max-width: 480px) {
        width: calc(100% - 32px);
        bottom: 20px;
        height: 48px;
        font-size: 15px;
    }

    @media (max-width: 360px) {
        width: calc(100% - 24px);
        bottom: 16px;
        height: 44px;
        font-size: 14px;
    }

    /* iOS Safari safe area - 키보드가 올라올 때를 대비 */
    @supports (padding: max(0px)) {
        bottom: max(24px, env(safe-area-inset-bottom));

        @media (max-width: 480px) {
            bottom: max(20px, env(safe-area-inset-bottom));
        }

        @media (max-width: 360px) {
            bottom: max(16px, env(safe-area-inset-bottom));
        }
    }
`;

const DoneButton = styled.button`
    width: calc(100% - 40px);
    max-width: 400px;
    height: 48px;
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    border: none;
    background: #d6d3d1;
    color: #ffffff;
    font-family: 'Pretendard Variable', 'Pretendard', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;

    &:hover:not(:disabled) {
        background: #c4c1bf;
    }

    &:active:not(:disabled) {
        background: #b3b0ae;
    }

    &:disabled {
        background: #cbcbcb;
        cursor: not-allowed;
        box-shadow: none;
    }

    @media (max-width: 480px) {
        width: calc(100% - 32px);
        bottom: 20px;
        height: 48px;
        font-size: 15px;
    }

    @media (max-width: 360px) {
        width: calc(100% - 24px);
        bottom: 16px;
        height: 44px;
        font-size: 14px;
    }

    /* iOS Safari safe area - 키보드가 올라올 때를 대비 */
    @supports (padding: max(0px)) {
        bottom: max(24px, env(safe-area-inset-bottom));

        @media (max-width: 480px) {
            bottom: max(20px, env(safe-area-inset-bottom));
        }

        @media (max-width: 360px) {
            bottom: max(16px, env(safe-area-inset-bottom));
        }
    }
`;
