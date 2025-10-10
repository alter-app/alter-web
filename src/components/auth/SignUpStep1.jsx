import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import GenderSelector from './GenderSelector';
import styled from 'styled-components';
import { formatPhoneNumber } from '../../utils/phoneUtils';

const SignUpStep1 = ({
    name,
    setName,
    phone,
    setPhone,
    birth,
    setBirth,
    gender,
    setGender,
    isValid,
    onNext,
}) => (
    <Container>
        <InfoTitle>회원님의 정보를 알려주세요!</InfoTitle>
        <InfoDesc>
            알터가 회원님이 동의해 주신 내용을 바탕으로 작성했어요.
            <br />
            틀리거나 빈 정보가 있다면 알려주시겠어요?
        </InfoDesc>
        <InputSection>
            <Row>
                <AuthInput
                    type='text'
                    placeholder='이름'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <GenderSelector value={gender} onChange={setGender} />
            </Row>
            <AuthInput
                type='tel'
                maxLength={13}
                placeholder='전화번호'
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            />
            <AuthInput
                type='text'
                placeholder='생년월일 8자리'
                value={birth}
                maxLength={8}
                onChange={(e) => setBirth(e.target.value)}
            />
        </InputSection>
        <InfoGuide>만약 내용이 없다면 모든 내용을 기입해 주세요!</InfoGuide>
        <NextButton disabled={!isValid} onClick={onNext}>
            다 했어요.
        </NextButton>
    </Container>
);

export default SignUpStep1;

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
        padding-right: max(20px, env(safe-area-inset-right));
        padding-top: max(24px, env(safe-area-inset-top));
        padding-bottom: max(24px, env(safe-area-inset-bottom));
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
    margin-bottom: 24px;

    @media (max-width: 480px) {
        gap: 14px;
        margin-bottom: 20px;
        max-width: 100%;
    }

    @media (max-width: 360px) {
        gap: 12px;
        margin-bottom: 18px;
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

const NextButton = styled.button`
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
