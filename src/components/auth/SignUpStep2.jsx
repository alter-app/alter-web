import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

const SignUpStep2 = ({
    nickname,
    setNickname,
    checkNickname,
    nicknameChecked,
    setNicknameChecked,
    nicknameCheckMessage,
    setNicknameCheckMessage,
    email,
    setEmail,
    checkEmail,
    emailChecked,
    setEmailChecked,
    emailCheckMessage,
    setEmailCheckMessage,
    password,
    passwordCheck,
    setPassword,
    setPasswordCheck,
    agreed,
    setAgreed,
    adAgreed,
    setAdAgreed,
    isValid,
    onPrev,
    onSubmit,
}) => (
    <Container>
        <TopSection>
            <BackButton onClick={onPrev}>
                <svg
                    width='28'
                    height='28'
                    viewBox='0 0 30 30'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M18 9L12 15L18 21'
                        stroke='#767676'
                        strokeWidth='1.7'
                    />
                </svg>
            </BackButton>
        </TopSection>
        <InfoTitle>이제 마지막이에요!</InfoTitle>
        <InfoDesc>
            회원님이 알터에서 불릴 닉네임을 알려주세요.
            <br />
            그리고 필수 정보 제공에 동의해 주시면 완료예요.
        </InfoDesc>

        <InputSection>
            <Row>
                <AuthInput
                    type='text'
                    placeholder='닉네임'
                    value={nickname}
                    onChange={(e) => {
                        const value = e.target.value;
                        // 한글, 영문, 숫자만 허용하는 정규식 (한글 유니코드 범위 수정)
                        const allowedPattern =
                            /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/;

                        if (allowedPattern.test(value)) {
                            setNickname(value);
                            setNicknameChecked(false);
                            setNicknameCheckMessage('');
                        }
                    }}
                    borderColor={
                        nicknameChecked
                            ? '1px solid #2DE283'
                            : nicknameCheckMessage
                            ? '1px solid #DC0000'
                            : undefined
                    }
                />
                <CheckButton
                    type='button'
                    onClick={async () => {
                        if (!nickname) return;
                        const isAvailable =
                            await checkNickname(nickname);
                        if (isAvailable) {
                            setNicknameChecked(true);
                            setNicknameCheckMessage(
                                '사용 가능한 닉네임입니다!'
                            );
                        } else {
                            setNicknameChecked(false);
                            setNicknameCheckMessage(
                                '이미 사용 중인 닉네임입니다.'
                            );
                        }
                    }}
                    disabled={!nickname}
                >
                    중복 확인
                </CheckButton>
            </Row>
            {nicknameCheckMessage && (
                <NicknameGuide
                    style={{
                        color: nicknameChecked
                            ? '#2DE283'
                            : '#DC0000',
                    }}
                >
                    {nicknameCheckMessage}
                </NicknameGuide>
            )}
            <Row>
                <AuthInput
                    type='email'
                    placeholder='이메일'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailChecked(false);
                        setEmailCheckMessage('');
                    }}
                    borderColor={
                        emailChecked
                            ? '1px solid #2DE283'
                            : emailCheckMessage
                            ? '1px solid #DC0000'
                            : undefined
                    }
                />
                <CheckButton
                    type='button'
                    onClick={async () => {
                        if (!email) return;
                        const result = await checkEmail(
                            email
                        );
                        if (result.success) {
                            if (result.duplicated) {
                                setEmailChecked(true);
                                setEmailCheckMessage(
                                    '사용 가능한 이메일입니다!'
                                );
                            } else {
                                setEmailChecked(false);
                                setEmailCheckMessage(
                                    '이미 사용 중인 이메일입니다.'
                                );
                            }
                        } else {
                            setEmailChecked(false);
                            setEmailCheckMessage(
                                result.message
                            );
                        }
                    }}
                    disabled={!email}
                >
                    중복 확인
                </CheckButton>
            </Row>
            {emailCheckMessage && (
                <EmailGuide
                    style={{
                        color: emailChecked
                            ? '#2DE283'
                            : '#DC0000',
                    }}
                >
                    {emailCheckMessage}
                </EmailGuide>
            )}
            <Column>
                <AuthInput
                    type='password'
                    placeholder='비밀번호'
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />
                <AuthInput
                    type='password'
                    placeholder='비밀번호 확인'
                    value={passwordCheck}
                    onChange={(e) =>
                        setPasswordCheck(e.target.value)
                    }
                />
            </Column>
        </InputSection>

        <CheckboxDiv>
            <OptionalLabel>
                <CustomCheckbox
                    checked={agreed}
                    onChange={(e) =>
                        setAgreed(e.target.checked)
                    }
                />
                <RequiredMark>(필수)</RequiredMark>{' '}
                <PolicyLinkText>
                    <Link to='/terms'>이용약관</Link>
                </PolicyLinkText>
                과{' '}
                <PolicyLinkText>
                    <Link to='/terms'>
                        {' '}
                        개인정보 보호정책
                    </Link>
                </PolicyLinkText>
                동의
            </OptionalLabel>

            <OptionalLabel>
                <CustomCheckbox
                    checked={adAgreed}
                    onChange={(e) =>
                        setAdAgreed(e.target.checked)
                    }
                />
                (선택) 이메일 및 SMS 광고성 정보 수신 동의
            </OptionalLabel>
        </CheckboxDiv>

        <SubmitButton
            disabled={!isValid}
            onClick={onSubmit}
        >
            가입하기
        </SubmitButton>
    </Container>
);

export default SignUpStep2;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    width: 100vw;
    max-width: 100vw;
    padding: 24px 20px;
    box-sizing: border-box;
    background: #ffffff;
    position: relative;
    overflow-x: hidden;

    @media (max-width: 480px) {
        padding: 20px 16px;
    }

    @media (max-width: 360px) {
        padding: 16px 12px;
    }

    /* iOS Safari safe area */
    @supports (padding: max(0px)) {
        padding-left: max(20px, env(safe-area-inset-left));
        padding-right: max(
            20px,
            env(safe-area-inset-right)
        );
        padding-top: max(24px, env(safe-area-inset-top));
        padding-bottom: max(
            24px,
            env(safe-area-inset-bottom)
        );
    }
`;

const InfoTitle = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #111111;
    text-align: left;
    margin-bottom: 16px;
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

const InfoDesc = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #767676;
    text-align: left;
    margin-bottom: 32px;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 19px;
        margin-bottom: 28px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 24px;
    }
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 16px;

    @media (max-width: 480px) {
        gap: 14px;
        margin-bottom: 14px;
        max-width: 100%;
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

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    @media (max-width: 480px) {
        gap: 14px;
    }

    @media (max-width: 360px) {
        gap: 12px;
    }
`;

const CheckButton = styled.button`
    min-width: 100px;
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
        min-width: 90px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 12px;
        border-radius: 8px;
        min-width: 80px;
    }
`;

const NicknameGuide = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 17px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
    }
`;

const EmailGuide = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 17px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
    }
`;

const CheckboxDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 24px;

    @media (max-width: 480px) {
        gap: 10px;
        margin-bottom: 20px;
        max-width: 100%;
    }

    @media (max-width: 360px) {
        gap: 8px;
        margin-bottom: 18px;
    }
`;

const OptionalLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    color: #767676;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    @media (max-width: 480px) {
        font-size: 12px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 11px;
        line-height: 17px;
    }
`;

const RequiredMark = styled.label`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    color: #dc0000;

    @media (max-width: 480px) {
        font-size: 12px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 11px;
        line-height: 17px;
    }
`;

const PolicyLinkText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 13px;
    line-height: 19px;
    color: #111111;

    a {
        color: #2de283;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 480px) {
        font-size: 12px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 11px;
        line-height: 17px;
    }
`;

const CustomCheckbox = styled.input.attrs({
    type: 'checkbox',
})`
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background: #ffffff;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    margin-top: 1px;

    &:checked {
        background: #2de283;
        border-color: #2de283;
    }

    &:hover {
        border-color: #2de283;
    }

    @media (max-width: 480px) {
        width: 16px;
        height: 16px;
    }

    @media (max-width: 360px) {
        width: 14px;
        height: 14px;
    }
`;

const TopSection = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;
    max-width: 400px;
    margin-bottom: 24px;

    @media (max-width: 480px) {
        margin-bottom: 20px;
    }

    @media (max-width: 360px) {
        margin-bottom: 18px;
    }
`;

const BackButton = styled.button`
    width: 48px;
    height: 48px;
    border: 1px solid #e5e5e5;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    svg {
        width: 28px;
        height: 28px;
    }

    &:hover {
        background: #f8f9fa;
        border-color: #2de283;
        transform: translateY(-1px);
    }

    &:active {
        background: #e9ecef;
        transform: translateY(0);
    }

    @media (max-width: 480px) {
        width: 44px;
        height: 44px;

        svg {
            width: 26px;
            height: 26px;
        }
    }

    @media (max-width: 360px) {
        width: 40px;
        height: 40px;

        svg {
            width: 24px;
            height: 24px;
        }
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    max-width: 400px;
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
