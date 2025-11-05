import styled from 'styled-components';

const FloatingActionButton = ({ onClick, icon }) => {
    return (
        <FABButton onClick={onClick} aria-label='공고 작성'>
            {icon || (
                <PlusIcon
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                >
                    <path
                        d='M12 5V19M5 12H19'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </PlusIcon>
            )}
        </FABButton>
    );
};

export default FloatingActionButton;

const FABButton = styled.button`
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #2de283;
    border: none;
    box-shadow: 0 4px 12px rgba(45, 226, 131, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    transition: all 0.3s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(45, 226, 131, 0.5);
    }

    &:active {
        transform: scale(0.95);
        box-shadow: 0 2px 8px rgba(45, 226, 131, 0.3);
    }

    @media (max-width: 768px) {
        width: 56px;
        height: 56px;
        bottom: 80px;
        right: 20px;
    }

    @supports (padding: max(0px)) {
        bottom: max(
            100px,
            calc(100px + env(safe-area-inset-bottom))
        );

        @media (max-width: 768px) {
            bottom: max(
                80px,
                calc(80px + env(safe-area-inset-bottom))
            );
        }
    }
`;

const PlusIcon = styled.svg`
    display: flex;
    align-items: center;
    justify-content: center;
`;
