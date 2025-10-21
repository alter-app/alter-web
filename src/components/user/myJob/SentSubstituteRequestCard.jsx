import styled from 'styled-components';
import { useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';

const SentSubstituteRequestCard = ({
    workspaceName,
    scheduleDate,
    scheduleTime,
    position,
    timeAgo,
    status,
    statusDescription,
    onCancel,
}) => {
    const [showModal, setShowModal] = useState(false);

    // 상태에 따른 표시 로직
    const getStatusInfo = () => {
        const getStatusColor = (statusValue) => {
            switch (statusValue) {
                case 'PENDING':
                    return '#2de283';
                case 'ACCEPTED':
                    return '#3b82f6';
                case 'REJECTED_BY_TARGET':
                    return '#ef4444';
                case 'APPROVED':
                    return '#3b82f6';
                case 'REJECTED_BY_APPROVER':
                    return '#ef4444';
                case 'CANCELLED':
                    return '#6b7280';
                case 'EXPIRED':
                    return '#6b7280';
                default:
                    return '#6b7280';
            }
        };

        const getStatusBgColor = (statusValue) => {
            switch (statusValue) {
                case 'PENDING':
                    return '#f0fdf4';
                case 'ACCEPTED':
                    return '#eff6ff';
                case 'REJECTED_BY_TARGET':
                    return '#fef2f2';
                case 'APPROVED':
                    return '#eff6ff';
                case 'REJECTED_BY_APPROVER':
                    return '#fef2f2';
                case 'CANCELLED':
                    return '#f9fafb';
                case 'EXPIRED':
                    return '#f9fafb';
                default:
                    return '#f9fafb';
            }
        };

        return {
            text: statusDescription || '알 수 없음',
            color: getStatusColor(status),
            bgColor: getStatusBgColor(status),
        };
    };

    const statusInfo = getStatusInfo();
    const canCancel = status === 'PENDING';

    const handleCancelClick = () => {
        setShowModal(true);
    };

    const handleModalConfirm = () => {
        setShowModal(false);
        onCancel();
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <CardContainer>
                <CardHeader>
                    <WorkplaceName>
                        {workspaceName}
                    </WorkplaceName>
                    {canCancel && (
                        <CancelButton
                            onClick={handleCancelClick}
                            title='대타 요청 취소'
                        >
                            <svg
                                width='14'
                                height='14'
                                viewBox='0 0 24 24'
                                fill='none'
                            >
                                <path
                                    d='M18 6L6 18M6 6L18 18'
                                    stroke='#999999'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </CancelButton>
                    )}
                </CardHeader>
                <CardSubtitle>
                    <ScheduleText>
                        <DateText>{scheduleDate}</DateText>
                        <Separator>·</Separator>
                        <TimeText>{scheduleTime}</TimeText>
                    </ScheduleText>
                    <PositionText>{position}</PositionText>
                </CardSubtitle>
                <CardFooter>
                    <TimeAgo>{timeAgo}</TimeAgo>
                    <StatusBadge
                        $color={statusInfo.color}
                        $bgColor={statusInfo.bgColor}
                    >
                        {statusInfo.text}
                    </StatusBadge>
                </CardFooter>
            </CardContainer>

            <ConfirmModal
                isOpen={showModal}
                onClose={handleModalCancel}
                onConfirm={handleModalConfirm}
                title='대타 요청 취소'
                message={`${workspaceName}의 대타 요청을 취소하시겠습니까?`}
                confirmText='취소하기'
                cancelText='아니오'
                confirmColor='#ff4444'
            />
        </>
    );
};

export default SentSubstituteRequestCard;

const CardContainer = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardSubtitle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ScheduleText = styled.p`
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    margin: 0;
`;

const DateText = styled.span`
    font-weight: 600;
    color: #333333;
`;

const Separator = styled.span`
    color: #999999;
    font-weight: 400;
`;

const TimeText = styled.span`
    font-weight: 400;
    color: #666666;
`;

const PositionText = styled.p`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #666666;
    margin: 0;
`;

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TimeAgo = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #999999;
`;

const StatusBadge = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: ${(props) => props.$color};
    background-color: ${(props) => props.$bgColor};
    border: 1px solid ${(props) => props.$color}20;
    white-space: nowrap;
`;

const CancelButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f5f5f5;
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        transition: stroke 0.2s ease;
    }

    &:hover svg {
        stroke: #ff4444;
    }
`;
