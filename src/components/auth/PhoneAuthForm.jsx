import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    initializeRecaptcha,
    clearRecaptcha,
    resetRecaptcha,
    sendPhoneVerification,
    verifyPhoneCode,
    createSignupSession,
} from '../../services/auth';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import styled from 'styled-components';
import {
    formatPhoneNumber,
    formatPhoneNumberToE164,
} from '../../utils/phoneUtils';

const PhoneAuthForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [verificationId, setVerificationId] =
        useState('');
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] =
        useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [phoneError, setPhoneError] = useState(''); // 전화번호 에러 메시지 상태
    const [codeError, setCodeError] = useState(''); // 인증 코드 에러 메시지 상태

    // 초기화 여부를 추적하기 위한 ref
    const isRecaptchaInitialized = useRef(false);

    useEffect(() => {
        let isMounted = true;
        const containerId = 'recaptcha-container';

        const init = async () => {
            if (!isRecaptchaInitialized.current) {
                // DOM 요소가 준비될 때까지 대기
                const containerElement = document.getElementById(containerId);
                if (!containerElement) {
                    console.warn('reCAPTCHA 컨테이너 요소를 찾을 수 없습니다.');
                    return;
                }

                // await 추가하여 초기화 완료 대기
                const verifier = await initializeRecaptcha(containerId, () => {
                    console.log('reCAPTCHA verified');
                });

                if (isMounted) {
                    // 초기화 실패 시 에러 메시지 표시
                    if (!verifier) {
                        setPhoneError(
                            'reCAPTCHA 초기화에 실패했습니다. 페이지를 새로고침하고 다시 시도해주세요.'
                        );
                        console.error('reCAPTCHA 초기화 실패');
                    }
                    isRecaptchaInitialized.current = true;
                }
            }
        };

        init();

        // 컴포넌트 언마운트 시에만 정리
        return () => {
            isMounted = false;
            clearRecaptcha(containerId);
            isRecaptchaInitialized.current = false;
        };
    }, []);

    const isValidPhoneNumber = (number) =>
        /^\+82\d{9,10}$/.test(number);

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
            // sendPhoneVerification 내부에서 resetRecaptcha를 호출하므로
            // 여기서는 try-catch만 잘 잡아주면 됩니다.
            const vId = await sendPhoneVerification(formattedE164);
            setVerificationId(vId);
            setIsCodeSent(true);
        } catch (error) {
            // 이미 auth.js에서 reset되었으므로 에러 메시지만 표시
            setPhoneError(error.message || '인증번호 전송 실패');
            console.error('인증번호 전송 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (verificationCode.length !== 6) {
            setCodeError('6자리 인증번호를 입력하세요.');
            return;
        }
        setLoading(true);
        setCodeError(''); // 에러 메시지 초기화
        try {
            await verifyPhoneCode(
                verificationId,
                verificationCode
            );
            // 인증 성공 후 회원가입 세션 생성 API 호출
            const signupSessionId =
                await createSignupSession(phoneNumber);
            console.log(
                'signupSessionId:',
                signupSessionId
            );

            // 회원가입 페이지로 이동, 상태에 넘기기
            navigate('/signup', {
                state: {
                    phone: phoneNumber,
                    signupSessionId,
                    ...(location.state || {}),
                },
            });
        } catch (error) {
            setCodeError(error.message || '');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <div id='recaptcha-container'></div>
            <InputSection>
                <Row>
                    <AuthInput
                        name='phoneNumber'
                        type='tel'
                        placeholder='010-1234-5678'
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(
                                formatPhoneNumber(
                                    e.target.value
                                )
                            );
                            setPhoneError('');
                        }}
                        maxLength={13}
                        required
                        disabled={isCodeSent}
                        borderColor={
                            phoneError
                                ? '1px solid #DC0000'
                                : undefined
                        }
                    />
                    <SendButton
                        type='button'
                        onClick={handleSendCode}
                        disabled={loading || !phoneNumber}
                    >
                        {loading
                            ? '인증번호 재전송'
                            : isCodeSent
                            ? '인증번호 재전송'
                            : '인증번호 전송'}
                    </SendButton>
                </Row>
                {phoneError && (
                    <PhoneErrorMessage>
                        {phoneError}
                    </PhoneErrorMessage>
                )}

                <AuthInput
                    name='verificationCode'
                    type='text'
                    placeholder='인증번호 입력'
                    value={verificationCode}
                    onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setCodeError('');
                    }}
                    maxLength={6}
                    required
                    disabled={loading || !verificationId}
                    borderColor={
                        codeError
                            ? '1px solid #DC0000'
                            : undefined
                    }
                />
                {codeError && (
                    <CodeErrorMessage>
                        {codeError}
                    </CodeErrorMessage>
                )}
            </InputSection>
            <InfoGuide>
                인증 확인이 안눌린다면 번호를 다시 확인해
                주세요.
            </InfoGuide>
            <VerifyButton
                type='button'
                onClick={handleVerifyCode}
                disabled={loading || !verificationId}
            >
                인증 확인
            </VerifyButton>
        </FormContainer>
    );
};

export default PhoneAuthForm;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    align-items: center;

    @media (max-width: 480px) {
        max-width: 100%;
    }
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-bottom: 16px;

    @media (max-width: 480px) {
        gap: 14px;
        margin-bottom: 14px;
    }

    @media (max-width: 360px) {
        gap: 12px;
        margin-bottom: 12px;
    }
`;

const Row = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;

    @media (max-width: 480px) {
        gap: 10px;
    }

    @media (max-width: 360px) {
        gap: 8px;
    }
`;

const SendButton = styled.button`
    min-width: 120px;
    height: 56px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 14px;
    font-family: 'Pretendard';
    font-weight: 500;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #25c973;
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        background: #1fb865;
        transform: translateY(0);
    }

    &:disabled {
        background: #cbcbcb;
        color: #ffffff;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 13px;
        border-radius: 10px;
        min-width: 110px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 12px;
        border-radius: 8px;
        min-width: 100px;
    }
`;

const VerifyButton = styled.button`
    width: 100%;
    height: 56px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 18px;
    font-family: 'Pretendard';
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(45, 226, 131, 0.3);

    &:hover:not(:disabled) {
        background: #25c973;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(45, 226, 131, 0.4);
    }

    &:active:not(:disabled) {
        background: #1fb865;
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(45, 226, 131, 0.3);
    }

    &:disabled {
        background: #cbcbcb;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 17px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 16px;
        border-radius: 8px;
    }
`;

const PhoneErrorMessage = styled.div`
    color: #dc0000;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    width: 100%;

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 17px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
    }
`;

const CodeErrorMessage = styled.div`
    color: #dc0000;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    width: 100%;

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 17px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
    }
`;

const InfoGuide = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #767676;
    text-align: center;
    margin-bottom: 24px;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 17px;
        margin-bottom: 20px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
        margin-bottom: 18px;
    }
`;
