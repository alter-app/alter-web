import styled from 'styled-components';

const CancelReputationModal = ({
    isOpen,
    onConfirm,
    onCancel,
    targetName,
    workplaceName,
}) => {
    if (!isOpen) return null;

    // targetName이 "업장"인 경우 실제 업장 이름으로 표시
    const displayName =
        targetName === '업장' ? workplaceName : targetName;

    return (
        <ModalOverlay>
            <ModalBox>
                <ModalText>
                    <strong>{displayName}</strong>님에게
                    <br />
                    보낸 평판 요청을
                    <br />
                    <strong style={{ color: '#ff4444' }}>
                        {' '}
                        취소
                    </strong>
                    하시겠습니까?
                </ModalText>
                <ModalSubText>
                    취소된 평판 요청은 복구할 수 없습니다.
                </ModalSubText>
                <ModalButtonRow>
                    <ModalCancelButton onClick={onCancel}>
                        아니오
                    </ModalCancelButton>
                    <ModalConfirmButton onClick={onConfirm}>
                        취소하기
                    </ModalConfirmButton>
                </ModalButtonRow>
            </ModalBox>
        </ModalOverlay>
    );
};

export default CancelReputationModal;

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
    padding: 20px;
`;

const ModalBox = styled.div`
    width: 100%;
    max-width: 320px;
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
`;

const ModalText = styled.div`
    font-family: 'Pretendard';
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 1.5;
`;

const ModalSubText = styled.div`
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 1.4;
`;

const ModalButtonRow = styled.div`
    display: flex;
    gap: 12px;
`;

const ModalCancelButton = styled.button`
    flex: 1;
    padding: 12px 0;
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: 600;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    color: #666666;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e9ecef;
        border-color: #dee2e6;
    }
`;

const ModalConfirmButton = styled.button`
    flex: 1;
    padding: 12px 0;
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: 600;
    background-color: #ff4444;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e63939;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;
