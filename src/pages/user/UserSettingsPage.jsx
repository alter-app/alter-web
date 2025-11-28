import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../../components/shared/PageHeader';
import BottomNavigation from '../../layouts/BottomNavigation';
import useAuthStore from '../../store/authStore';
import { logout } from '../../services/auth';
import ConfirmModal from '../../components/shared/ConfirmModal';

const UserSettingsPage = () => {
    const navigate = useNavigate();
    const { logout: logoutStore, scope: authScope } =
        useAuthStore();
    const [isLogoutModalOpen, setIsLogoutModalOpen] =
        useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await logout(authScope);
            logoutStore();
            navigate('/login');
        } catch (error) {
            // API 호출 실패해도 로컬 상태는 로그아웃 처리
            logoutStore();
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
        }
    };

    const handleLogoutCancel = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <PageHeader
                title='설정'
                showBackButton={true}
            />
            <Container>
                <SettingsContent>
                    <SettingsCard>
                        <LogoutButton
                            type='button'
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut
                                ? '로그아웃 중...'
                                : '로그아웃'}
                        </LogoutButton>
                    </SettingsCard>
                </SettingsContent>
            </Container>
            <BottomNavigation />
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                title='로그아웃'
                message='정말 로그아웃하시겠습니까?'
                confirmText='로그아웃'
                cancelText='취소'
                onConfirm={handleLogoutConfirm}
                onClose={handleLogoutCancel}
                confirmColor='#d64545'
            />
        </>
    );
};

export default UserSettingsPage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    padding-top: 60px;
    padding-bottom: 80px;

    @media (max-width: 480px) {
        min-height: calc(100vh - 70px);
        padding-bottom: 70px;
    }

    @media (max-width: 360px) {
        min-height: calc(100vh - 60px);
        padding-bottom: 60px;
    }
`;

const SettingsContent = styled.div`
    flex: 1;
    background: #f8f9fa;
    padding: 20px;
`;

const SettingsCard = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const LogoutButton = styled.button`
    width: 100%;
    padding: 16px;
    border: 1px solid #ffe3e3;
    background: #ffffff;
    color: #d64545;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:hover:not(:disabled) {
        background: #fff5f5;
        border-color: #d64545;
    }

    &:active:not(:disabled) {
        background: #ffe3e3;
        transform: scale(0.98);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
