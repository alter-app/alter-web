import PhoneAuthForm from '../components/auth/PhoneAuthForm';
import styled from 'styled-components';

const PhoneAuthPage = () => {
    return (
        <Container>
            <InfoTitle>
                본인 확인을 위해 인증해 주세요!
            </InfoTitle>
            <InfoDesc>
                알터 회원가입을 위한 인증 번호를
                <br />
                휴대폰 문자로 발송해 드려요!
            </InfoDesc>
            <PhoneAuthForm />
        </Container>
    );
};

export default PhoneAuthPage;

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
