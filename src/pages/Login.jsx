import React, { useState } from 'react';
import KakaoLoginButton from '../components/auth/KakaoLoginButton';
import AppleLoginButton from '../components/auth/AppleLoginButton';
import AlterLogo from '../assets/logos/signature CB(상하).png';
import styled from 'styled-components';
import ManagerKakaoLoginButton from '../components/manager/ManagerKakaoLoginButton';
import ManagerAppleLoginButton from '../components/manager/ManagerAppleLoginButton';

const Login = () => {
    const [isManager, setIsManager] = useState(false); // false: 일반 회원, true: 기업 회원

    return (
        <SBackground>
            <Logo src={AlterLogo} alt='알터 로고' />

            <ToggleWrapper>
                <ToggleButton
                    $active={!isManager}
                    onClick={() => setIsManager(false)}
                >
                    일반 회원
                </ToggleButton>
                <ToggleButton
                    $active={isManager}
                    onClick={() => setIsManager(true)}
                >
                    기업 회원
                </ToggleButton>
            </ToggleWrapper>

            {isManager ? (
                <Column>
                    <ManagerKakaoLoginButton />
                    <ManagerAppleLoginButton />
                </Column>
            ) : (
                <Column>
                    <KakaoLoginButton />
                    <AppleLoginButton />
                </Column>
            )}
        </SBackground>
    );
};

export default Login;

const Logo = styled.img`
    height: 300px;
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
    margin-top: 24px;
`;

const ToggleWrapper = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 24px;
`;

const ToggleButton = styled.button`
    padding: 10px 24px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    background-color: ${({ $active }) =>
        $active ? '#2de283' : '#eee'};
    color: ${({ $active }) => ($active ? '#fff' : '#333')};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ $active }) =>
            $active ? '#2de283' : '#e6fcef'};
    }
`;
