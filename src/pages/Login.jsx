import KakaoLoginButton from '../components/auth/KakaoLoginButton';
import AppleLoginButton from '../components/auth/AppleLoginButton';
import AlterLogo from '../assets/logos/signature CB(상하).png';
import styled from 'styled-components';
import ManagerKakaoLoginButton from '../components/manager/ManagerKakaoLoginButton';

const Login = () => {
    return (
        <SBackground>
            <Logo src={AlterLogo} alt='알터 로고' />
            <Row>
                <KakaoLoginButton />
                <AppleLoginButton />
                <Divider />
                <ManagerKakaoLoginButton />
            </Row>
        </SBackground>
    );
};

export default Login;

const Logo = styled.img`
    height: 300px;
    width: 560px;
    width: auto;
    margin-top: 110px;
    margin-bottom: 52px;
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
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: #d9d9d9;
`;
