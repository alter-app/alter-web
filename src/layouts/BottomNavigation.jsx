import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <BottomNavContainer>
            <NavItem
                $active={isActive('/job-lookup-map')}
                onClick={() => navigate('/job-lookup-map')}
            >
                <HomeIcon
                    $active={isActive('/job-lookup-map')}
                />
                <NavLabel
                    $active={isActive('/job-lookup-map')}
                >
                    홈
                </NavLabel>
            </NavItem>
            <NavItem
                $active={isActive('/my-applications')}
                onClick={() => navigate('/my-applications')}
            >
                <CalendarIcon
                    $active={isActive('/my-applications')}
                />
                <NavLabel
                    $active={isActive('/my-applications')}
                >
                    내알바
                </NavLabel>
            </NavItem>
            <NavItem
                $active={isActive('/mypage')}
                onClick={() => navigate('/mypage')}
            >
                <ProfileIcon
                    $active={isActive('/mypage')}
                />
                <NavLabel $active={isActive('/mypage')}>
                    MY
                </NavLabel>
            </NavItem>
        </BottomNavContainer>
    );
};

export default BottomNavigation;

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
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
    min-width: 60px;

    &:hover {
        background: ${(props) =>
            props.$active ? 'transparent' : '#f8f9fa'};
    }

    &:active {
        transform: scale(0.95);
    }

    @media (max-width: 480px) {
        padding: 6px 10px;
        min-width: 50px;
    }

    @media (max-width: 360px) {
        padding: 4px 8px;
        min-width: 45px;
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

const CalendarIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    background: ${(props) =>
        props.$active ? '#399982' : '#666666'};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E")
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
