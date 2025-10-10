import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({
    title,
    onBack,
    variant = 'sticky',
    showBackButton = true,
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <Header
            variant={variant}
            $showBackButton={showBackButton}
        >
            {showBackButton && (
                <BackButton onClick={handleBack}>
                    <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                    >
                        <path
                            d='M15 18L9 12L15 6'
                            stroke='#333'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>
                </BackButton>
            )}
            <HeaderTitle $hasBackButton={showBackButton}>
                {title}
            </HeaderTitle>
        </Header>
    );
};

export default PageHeader;

const Header = styled.div`
    position: ${(props) =>
        props.variant === 'sticky' ? 'sticky' : 'fixed'};
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    padding-left: ${(props) =>
        props.$showBackButton ? '16px' : '24px'};
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    @supports (padding: max(0px)) {
        padding-top: max(0px, env(safe-area-inset-top));
        height: calc(
            60px + max(0px, env(safe-area-inset-top))
        );
    }

    @media (max-width: 480px) {
        height: 56px;
        padding-left: ${(props) =>
            props.$showBackButton ? '12px' : '24px'};

        @supports (padding: max(0px)) {
            height: calc(
                56px + max(0px, env(safe-area-inset-top))
            );
        }
    }

    @media (max-width: 360px) {
        height: 52px;
        padding-left: ${(props) =>
            props.$showBackButton ? '10px' : '24px'};

        @supports (padding: max(0px)) {
            height: calc(
                52px + max(0px, env(safe-area-inset-top))
            );
        }
    }
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        background: #f5f5f5;
    }

    &:active {
        background: #e0e0e0;
        transform: scale(0.95);
    }

    @media (max-width: 480px) {
        width: 36px;
        height: 36px;
    }

    @media (max-width: 360px) {
        width: 32px;
        height: 32px;
    }
`;

const HeaderTitle = styled.h1`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    color: #333333;
    margin: 0;
    margin-left: ${(props) =>
        props.$hasBackButton ? '12px' : '0'};

    @media (max-width: 480px) {
        font-size: 20px;
        margin-left: ${(props) =>
            props.$hasBackButton ? '10px' : '0'};
    }

    @media (max-width: 360px) {
        font-size: 18px;
        margin-left: ${(props) =>
            props.$hasBackButton ? '8px' : '0'};
    }
`;
