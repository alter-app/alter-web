import styled from 'styled-components';

interface ConfirmModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    status: 'ACCEPTED' | 'REJECTED';
}

const ConfirmModal = ({ onConfirm, onCancel, status }: ConfirmModalProps) => {
    return (
        <ModalOverlay>
            <ModalBox>
                <ModalText>
                    해당 지원자를
                    <strong
                        style={{
                            color:
                                status === 'ACCEPTED'
                                    ? '#2de283'
                                    : '#dc0000',
                        }}
                    >
                        {status === 'ACCEPTED'
                            ? ' 수락 '
                            : ' 거절 '}
                    </strong>
                    하시겠습니까?
                </ModalText>
                <ModalButtonRow>
                    <ModalCancelButton onClick={onCancel}>
                        취소
                    </ModalCancelButton>
                    <ModalConfirmButton
                        $accept={status === 'ACCEPTED'}
                        onClick={onConfirm}
                    >
                        확인
                    </ModalConfirmButton>
                </ModalButtonRow>
            </ModalBox>
        </ModalOverlay>
    );
};

export default ConfirmModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalBox = styled.div`
    width: 300px;
    background: white;
    border-radius: 10px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
`;

const ModalText = styled.div`
    font-size: 16px;
    text-align: center;
    color: #111;
`;

const ModalButtonRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
`;

const ModalCancelButton = styled.button`
    flex: 1;
    padding: 10px 0;
    font-size: 14px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #111;
`;

interface ModalConfirmButtonProps {
    $accept?: boolean;
}

const ModalConfirmButton = styled.button<ModalConfirmButtonProps>`
    flex: 1;
    padding: 10px 0;
    font-size: 14px;
    background-color: ${(props) =>
        props.$accept ? '#2de283' : '#dc0000'};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            props.$accept ? '#1fc270' : '#b80000'};
    }
`;
