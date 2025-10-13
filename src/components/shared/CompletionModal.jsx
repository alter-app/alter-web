import styled from 'styled-components';

const CompletionModal = ({
    isOpen,
    onClose,
    icon = '✅',
    title = '작업 완료!',
    description = '작업이 성공적으로 완료되었습니다.',
    buttonText = '확인',
}) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Content>
                    <SuccessIcon>{icon}</SuccessIcon>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </Content>

                <ButtonGroup>
                    <ConfirmButton onClick={onClose}>
                        {buttonText}
                    </ConfirmButton>
                </ButtonGroup>
            </Modal>
        </Overlay>
    );
};

export default CompletionModal;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const Modal = styled.div`
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 320px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    animation: modalAppear 0.3s ease-out;

    @keyframes modalAppear {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;

const Content = styled.div`
    padding: 32px 24px 24px 24px;
    text-align: center;
`;

const SuccessIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h2`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    color: #333333;
    margin: 0 0 12px 0;
`;

const Description = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    padding: 0 24px 24px 24px;
`;

const ConfirmButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #25c973;
        transform: translateY(-1px);
    }

    &:active {
        background: #1fb865;
        transform: translateY(0);
    }
`;
