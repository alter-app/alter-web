import PhoneAuthForm from '../components/auth/PhoneAuthForm';
import styled from 'styled-components';

const PhoneAuthPage = () => {
    return (
        <Container>
            <SBackground>
                <SFormWrapper>
                    <InfoTitle>
                        본인 확인을 위해 인증해 주세요!
                    </InfoTitle>
                    <InfoDesc>
                        알터 회원가입을 위한 인증 번호를
                        <br />
                        휴대폰 문자로 발송해 드려요!
                    </InfoDesc>
                    <PhoneAuthForm />
                </SFormWrapper>
            </SBackground>
        </Container>
    );
};

export default PhoneAuthPage;

const InfoDesc = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;
    margin-top: 24px;
    margin-bottom: 36px;
`;

const InfoTitle = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 28px;
    line-height: 38px;
    color: #111111;
`;

const SBackground = styled.div`
    margin-top: 60px;
    width: 560px;
    height: 720px;
    max-height: 720px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 4px 4px 12px 2px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const SFormWrapper = styled.div``;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
