import KakaoLoginButton from '../components/auth/KakaoLoginButton';
import AppleLoginButton from '../components/auth/AppleLoginButton';
import AlterLogo from '../assets/logos/signature CB(상하).png';
import styled from 'styled-components';
import ManagerKakaoLoginButton from '../components/manager/ManagerKakaoLoginButton';
import ManagerAppleLoginButton from '../components/manager/ManagerAppleLoginButton';

const Login = () => {
    return (
        <SBackground>
            <Logo src={AlterLogo} alt='알터 로고' />
            <Column>
                <Row>
                    <Title>일반 회원</Title>
                    <Column>
                        <KakaoLoginButton />
                        <AppleLoginButton />
                    </Column>
                </Row>
                <Divider />
                <Row>
                    <Title>기업 회원</Title>
                    <Column>
                        <ManagerKakaoLoginButton />
                        <ManagerAppleLoginButton />
                    </Column>
                </Row>
            </Column>
        </SBackground>
    );
};

export default Login;

const Logo = styled.img`
    height: 300px;
    width: 560px;
    width: auto;
`;

const SBackground = styled.div`
    margin-top: 60px;
    padding: 40px;
    box-sizing: border-box;
    max-height: 720px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 4px 4px 12px 2px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: #d9d9d9;
`;

const Title = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
`;
