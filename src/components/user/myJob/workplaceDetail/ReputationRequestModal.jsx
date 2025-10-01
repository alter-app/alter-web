import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReputationRequestModal = ({ isOpen, onClose, employee, workplaceId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleRequestReputation = async () => {
        setIsLoading(true);
        try {
            // 평판 작성 페이지로 이동하면서 필요한 데이터 전달
            navigate('/reputation-write', {
                state: {
                    employeeId: employee.id,
                    employeeName: employee.name,
                    workplaceId: workplaceId,
                    type: 'worker', // 근무자에 대한 평판
                },
            });
        } catch (error) {
            console.error('평판 요청 중 오류:', error);
            alert('평판 요청 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Header>
                    <Title>평판 요청</Title>
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
                    <EmployeeInfo>
                        <Avatar>{employee.position?.emoji || '👤'}</Avatar>
                        <EmployeeDetails>
                            <Name>{employee.name}</Name>
                            <Position>
                                {employee.position?.description || '직원'}
                            </Position>
                        </EmployeeDetails>
                    </EmployeeInfo>

                    <Description>
                        {employee.name}님에 대한 평판을 작성하시겠습니까?
                    </Description>

                    <Notice>
                        • 최소 2개 이상의 키워드를 선택해주세요
                        <br />• 작성한 평판은 다른 사용자들에게 도움이 됩니다
                    </Notice>
                </Content>

                <ButtonGroup>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                    <RequestButton
                        onClick={handleRequestReputation}
                        disabled={isLoading}
                    >
                        {isLoading ? '요청 중...' : '평판 작성하기'}
                    </RequestButton>
                </ButtonGroup>
            </Modal>
        </Overlay>
    );
};

export default ReputationRequestModal;

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
    max-height: 80vh;
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

const EmployeeInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
`;

const Avatar = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border: 2px solid #e9ecef;
`;

const EmployeeDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Name = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const Position = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const Description = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    line-height: 1.5;
    margin-bottom: 16px;
`;

const Notice = styled.div`
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 1.5;

    & > * {
        margin: 0 0 4px 0;

        &:last-child {
            margin-bottom: 0;
        }
    }
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

const RequestButton = styled.button`
    flex: 1;
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

    &:hover:not(:disabled) {
        background: #25c973;
    }

    &:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }
`;
