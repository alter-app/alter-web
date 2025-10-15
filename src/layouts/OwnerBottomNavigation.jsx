import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const OwnerBottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/main') {
            // 매니저 메인 관련 모든 하위 경로들
            return (
                location.pathname === '/main' ||
                location.pathname.startsWith('/main/')
            );
        }
        if (path === '/owner/notifications') {
            // 알림 관련 모든 하위 경로들
            return (
                location.pathname ===
                    '/owner/notifications' ||
                location.pathname.startsWith(
                    '/owner/notifications/'
                )
            );
        }
        if (path === '/owner/chat') {
            // 채팅 관련 모든 하위 경로들
            return (
                location.pathname === '/owner/chat' ||
                location.pathname.startsWith('/owner/chat/')
            );
        }
        if (path === '/owner/mypage') {
            // 마이페이지 관련 모든 하위 경로들
            return (
                location.pathname === '/owner/mypage' ||
                location.pathname.startsWith(
                    '/owner/mypage/'
                )
            );
        }
        return location.pathname === path;
    };

    return (
        <BottomNavContainer>
            <NavItem
                $active={isActive('/main')}
                onClick={() => navigate('/main')}
            >
                <HomeIcon $active={isActive('/main')} />
                <NavLabel $active={isActive('/main')}>
                    홈
                </NavLabel>
            </NavItem>
            <NavItem
                $active={isActive('/owner/notifications')}
                onClick={() =>
                    navigate('/owner/notifications')
                }
            >
                <NotificationIcon
                    $active={isActive(
                        '/owner/notifications'
                    )}
                />
                <NavLabel
                    $active={isActive(
                        '/owner/notifications'
                    )}
                >
                    알림
                </NavLabel>
            </NavItem>
            <NavItem
                $active={isActive('/owner/chat')}
                onClick={() => navigate('/owner/chat')}
            >
                <ChatIcon
                    $active={isActive('/owner/chat')}
                />
                <NavLabel $active={isActive('/owner/chat')}>
                    채팅
                </NavLabel>
            </NavItem>
            <NavItem
                $active={isActive('/owner/mypage')}
                onClick={() => navigate('/owner/mypage')}
            >
                <ProfileIcon
                    $active={isActive('/owner/mypage')}
                />
                <NavLabel
                    $active={isActive('/owner/mypage')}
                >
                    MY
                </NavLabel>
            </NavItem>
        </BottomNavContainer>
    );
};

export default OwnerBottomNavigation;

const BottomNavContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #ffffff;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
    padding: 12px 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    @supports (padding: max(0px)) {
        padding-bottom: max(
            12px,
            env(safe-area-inset-bottom)
        );
    }

    @media (max-width: 480px) {
        height: 60px;
        padding: 14px 0;

        @supports (padding: max(0px)) {
            padding-bottom: max(
                14px,
                env(safe-area-inset-bottom)
            );
        }
    }

    @media (max-width: 360px) {
        height: 50px;
        padding: 12px 0;

        @supports (padding: max(0px)) {
            padding-bottom: max(
                12px,
                env(safe-area-inset-bottom)
            );
        }
    }
`;

const NavItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 8px 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    min-width: 50px;
    flex: 1;

    &:hover {
        background: ${(props) =>
            props.$active ? 'transparent' : '#f8f9fa'};
    }

    &:active {
        transform: scale(0.95);
    }

    @media (max-width: 480px) {
        padding: 6px 6px;
        min-width: 40px;
    }

    @media (max-width: 360px) {
        padding: 4px 4px;
        min-width: 35px;
    }
`;

const HomeIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    background: ${(props) =>
        props.$active ? '#399982' : '#666666'};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
    transition: all 0.2s ease;

    @media (max-width: 480px) {
        width: 22px;
        height: 22px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        width: 20px;
        height: 20px;
        margin-bottom: 2px;
    }

    @media (max-width: 320px) {
        width: 18px;
        height: 18px;
    }
`;

const ChatIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    background: ${(props) =>
        props.$active ? '#399982' : '#666666'};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
    transition: all 0.2s ease;

    @media (max-width: 480px) {
        width: 22px;
        height: 22px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        width: 20px;
        height: 20px;
        margin-bottom: 2px;
    }

    @media (max-width: 320px) {
        width: 18px;
        height: 18px;
    }
`;

const NotificationIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    background: ${(props) =>
        props.$active ? '#399982' : '#666666'};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
    transition: all 0.2s ease;

    @media (max-width: 480px) {
        width: 22px;
        height: 22px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        width: 20px;
        height: 20px;
        margin-bottom: 2px;
    }

    @media (max-width: 320px) {
        width: 18px;
        height: 18px;
    }
`;

const ProfileIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    background: ${(props) =>
        props.$active ? '#399982' : '#666666'};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
    transition: all 0.2s ease;

    @media (max-width: 480px) {
        width: 22px;
        height: 22px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        width: 20px;
        height: 20px;
        margin-bottom: 2px;
    }

    @media (max-width: 320px) {
        width: 18px;
        height: 18px;
    }
`;

const NavLabel = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: ${(props) =>
        props.$active ? '#399982' : '#666666'};
    transition: all 0.2s ease;
    text-align: center;
    line-height: 1.2;

    @media (max-width: 480px) {
        font-size: 11px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
    }
`;
