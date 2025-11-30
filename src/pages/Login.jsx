import { useState } from 'react';
import KakaoLoginButton from '../components/user/KakaoLoginButton';
import AppleLoginButton from '../components/user/AppleLoginButton';
import AlterLogo from '../assets/logos/signature CB(상하).png';
import styled from 'styled-components';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { loginIDPW } from '../services/auth';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await loginIDPW(
                { email, password },
                setAuth,
                navigate
            );
            console.log('로그인 성공:', data);
        } catch (error) {
            alert(error.message);
        }
    };

    const goToSignup = () => {
        navigate('/phoneauth');
    };

    return (
        <Container>
            <Logo src={AlterLogo} alt='알터 로고' />
            <InputSection>
                <Column>
                    <AuthInput
                        type='text'
                        placeholder='이메일'
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                    <AuthInput
                        type='password'
                        placeholder='비밀번호'
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </Column>
                <LoginButton onClick={handleLogin}>
                    로그인
                </LoginButton>
            </InputSection>
            <DividerWithText>
                <Line />
                <CenterText>간편 로그인</CenterText>
                <Line />
            </DividerWithText>
            <SocialLoginSection>
                <KakaoLoginButton />
                <AppleLoginButton />
                <AuthLinks>
                    <span
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/find-id')}
                    >
                        아이디 찾기
                    </span>
                    <span>|</span>
                    <span>비밀번호 찾기</span>
                    <span>|</span>
                    <span
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={goToSignup}
                    >
                        회원가입
                    </span>
                </AuthLinks>
            </SocialLoginSection>
        </Container>
    );
};

export default Login;

const Logo = styled.img`
    height: 200px;
    width: auto;
    margin-bottom: 40px;

    @media (max-width: 480px) {
        height: 160px;
        margin-bottom: 32px;
    }

    @media (max-width: 360px) {
        height: 130px;
        margin-bottom: 28px;
    }
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        gap: 16px;
        max-width: 100%;
    }

    @media (max-width: 360px) {
        gap: 14px;
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

const LoginButton = styled.button`
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

    &:hover {
        background: #25c973;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(45, 226, 131, 0.4);
    }

    &:active {
        background: #1fb865;
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(45, 226, 131, 0.3);
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

const SocialLoginSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 400px;
    align-items: center;

    @media (max-width: 480px) {
        gap: 14px;
        max-width: 100%;
    }

    @media (max-width: 360px) {
        gap: 12px;
    }
`;

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

const AuthLinks = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #767676;
    margin-top: 10px;

    span {
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
            color: #2de283;
        }
    }

    @media (max-width: 480px) {
        font-size: 13px;
        gap: 6px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        gap: 4px;
    }
`;

const DividerWithText = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 400px;
    margin: 32px 0;

    @media (max-width: 480px) {
        margin: 28px 0;
        max-width: 100%;
    }

    @media (max-width: 360px) {
        margin: 24px 0;
    }
`;

const Line = styled.div`
    flex: 1;
    height: 1px;
    background-color: #d9d9d9;
`;

const CenterText = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #999999;
    margin: 0 15px;

    @media (max-width: 480px) {
        font-size: 14px;
        margin: 0 10px;
    }

    @media (max-width: 360px) {
        font-size: 13px;
        margin: 0 8px;
    }
`;
