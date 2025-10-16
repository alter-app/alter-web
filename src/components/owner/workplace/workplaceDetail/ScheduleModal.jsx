import styled from 'styled-components';

const ScheduleModal = ({
    isOpen,
    onClose,
    selectedDate,
    selectedDay,
    schedules = [],
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay onClick={handleBackdropClick}>
            <ModalContainer>
                <ModalHeader>
                    <Title>
                        {selectedDate}일 ({selectedDay})
                        스케줄
                    </Title>
                    <CloseButton onClick={onClose}>
                        <svg
                            width='24'
                            height='24'
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
                </ModalHeader>

                <ModalContent>
                    {schedules.length === 0 ? (
                        <EmptyMessage>
                            <EmptyIcon>🗓️</EmptyIcon>
                            <EmptyText>
                                이 날에는 스케줄이 없습니다.
                            </EmptyText>
                        </EmptyMessage>
                    ) : (
                        <ScheduleList>
                            {schedules.map(
                                (schedule, index) => (
                                    <ScheduleItem
                                        key={index}
                                    >
                                        <WorkerInfo>
                                            <WorkerName>
                                                {schedule
                                                    .assignedWorker
                                                    ?.workerName ||
                                                    '알 수 없는 직원'}
                                            </WorkerName>
                                            <Position>
                                                {schedule.position ||
                                                    '직원'}
                                            </Position>
                                        </WorkerInfo>
                                        <TimeInfo>
                                            <TimeRange>
                                                {schedule.startDateTime &&
                                                    new Date(
                                                        schedule.startDateTime
                                                    ).toLocaleTimeString(
                                                        'ko-KR',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                {schedule.endDateTime &&
                                                    ` - ${new Date(
                                                        schedule.endDateTime
                                                    ).toLocaleTimeString(
                                                        'ko-KR',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}`}
                                            </TimeRange>
                                        </TimeInfo>
                                    </ScheduleItem>
                                )
                            )}
                        </ScheduleList>
                    )}
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default ScheduleModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
`;

const ModalContainer = styled.div`
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background: #f8f9fa;
`;

const Title = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s ease;

    &:hover {
        background: #e0e0e0;
    }
`;

const ModalContent = styled.div`
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
`;

const EmptyMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
`;

const EmptyIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
`;

const EmptyText = styled.p`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #666666;
    margin: 0;
`;

const ScheduleList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ScheduleItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    border-left: 4px solid #1976d2;
`;

const WorkerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const WorkerName = styled.div`
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

const TimeInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
`;

const TimeRange = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #1976d2;
`;

const Status = styled.div`
    padding: 4px 8px;
    border-radius: 6px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    background: ${(props) => {
        if (props.status === 'CONFIRMED') return '#e8f5e8';
        if (props.status === 'PLANNED') return '#fff3e0';
        return '#f0f0f0';
    }};
    color: ${(props) => {
        if (props.status === 'CONFIRMED') return '#2e7d32';
        if (props.status === 'PLANNED') return '#e65100';
        return '#666666';
    }};
`;
