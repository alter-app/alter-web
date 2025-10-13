import styled from 'styled-components';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = '확인',
    message = '정말로 진행하시겠습니까?',
    confirmText = '확인',
    cancelText = '취소',
    confirmColor = '#2de283',
    showCancel = true,
}) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Header>
                    <Title>{title}</Title>
                    <CloseButton onClick={onClose}>
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M18 6L6 18M6 6L18 18'
                                stroke='#666666'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </CloseButton>
                </Header>

                <Content>
                    <Message>{message}</Message>
                </Content>

                <ButtonGroup>
                    {showCancel && (
                        <CancelButton onClick={onClose}>
                            {cancelText}
                        </CancelButton>
                    )}
                    <ConfirmButton
                        onClick={onConfirm}
                        $confirmColor={confirmColor}
                    >
                        {confirmText}
                    </ConfirmButton>
                </ButtonGroup>
            </Modal>
        </Overlay>
    );
};

export default ConfirmModal;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const Modal = styled.div`
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 16px 24px;
    border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
    }
`;

const Content = styled.div`
    padding: 24px;
`;

const Message = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    line-height: 1.5;
    text-align: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    padding: 16px 24px 24px 24px;
`;

const CancelButton = styled.button`
    flex: 1;
    height: 48px;
    border: 1px solid #e0e0e0;
    background: #ffffff;
    color: #666666;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f8f9fa;
        border-color: #d0d0d0;
    }
`;

const ConfirmButton = styled.button`
    flex: 1;
    height: 48px;
    border: none;
    background: ${(props) => props.$confirmColor};
    color: #ffffff;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;
