import styled from 'styled-components';
import { useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';

const OwnerSubstituteRequestCard = ({
    substituteRequestId,
    scheduleId,
    startDateTime,
    endDateTime,
    position,
    requesterName,
    requestType,
    acceptedWorkerName,
    status,
    statusDescription,
    requestReason,
    createdAt,
    acceptedAt,
    processedAt,
    onAccept,
    onReject,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');

    const getStatusInfo = () => {
        switch (status) {
            case 'PENDING':
                return {
                    color: '#ffa726',
                    bgColor: '#fff3e0',
                    text: '대기 중',
                };
            case 'ACCEPTED':
                return {
                    color: '#2de283',
                    bgColor: '#f0fdf4',
                    text: '수락됨',
                };
            case 'APPROVED':
                return {
                    color: '#3b82f6',
                    bgColor: '#eff6ff',
                    text: '승인됨',
                };
            case 'REJECTED_BY_TARGET':
                return {
                    color: '#ef4444',
                    bgColor: '#fef2f2',
                    text: '대상자 거절',
                };
            case 'REJECTED_BY_APPROVER':
                return {
                    color: '#ef4444',
                    bgColor: '#fef2f2',
                    text: '승인자 거절',
                };
            case 'CANCELLED':
                return {
                    color: '#6b7280',
                    bgColor: '#f9fafb',
                    text: '취소됨',
                };
            case 'EXPIRED':
                return {
                    color: '#6b7280',
                    bgColor: '#f9fafb',
                    text: '만료됨',
                };
            default:
                return {
                    color: '#6b7280',
                    text: statusDescription || '알 수 없음',
                };
        }
    };

    const statusInfo = getStatusInfo();
    const canAccept = status === 'PENDING';
    const canReject = status === 'PENDING';

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatTimeAgo = (dateTimeString) => {
        if (!dateTimeString) return '';
        const now = new Date();
        const past = new Date(dateTimeString);
        const diffMs = now - past;
        const diffHours = Math.floor(
            diffMs / (1000 * 60 * 60)
        );
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays}일 전`;
        } else if (diffHours > 0) {
            return `${diffHours}시간 전`;
        } else {
            const diffMinutes = Math.floor(
                diffMs / (1000 * 60)
            );
            return `${diffMinutes}분 전`;
        }
    };

    const scheduleDate = formatDateTime(startDateTime);
    const scheduleTime = `${formatTime(
        startDateTime
    )} ~ ${formatTime(endDateTime)}`;
    const timeAgo = formatTimeAgo(createdAt);

    const handleAcceptClick = () => {
        setModalType('accept');
        setShowModal(true);
    };

    const handleRejectClick = () => {
        setModalType('reject');
        setShowModal(true);
    };

    const handleModalConfirm = () => {
        setShowModal(false);
        if (modalType === 'accept') {
            onAccept();
        } else if (modalType === 'reject') {
            onReject();
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <CardContainer>
                <CardHeader>
                    <ScheduleInfo>
                        <ScheduleDate>
                            {scheduleDate}
                        </ScheduleDate>
                        <ScheduleTime>
                            {scheduleTime}
                        </ScheduleTime>
                    </ScheduleInfo>
                    <StatusBadge
                        $color={statusInfo.color}
                        $bgColor={statusInfo.bgColor}
                    >
                        {statusInfo.text}
                    </StatusBadge>
                </CardHeader>
                <PositionTimeRow>
                    <PositionText>{position}</PositionText>
                    <TimeInfo>{timeAgo}</TimeInfo>
                </PositionTimeRow>
                <CardContent>
                    <InfoSection>
                        <RequesterInfo>
                            <RequesterLabel>
                                요청자
                            </RequesterLabel>
                            <RequesterName>
                                {requesterName}
                            </RequesterName>
                        </RequesterInfo>
                        {acceptedWorkerName && (
                            <AcceptedWorkerInfo>
                                <AcceptedWorkerLabel>
                                    수락자
                                </AcceptedWorkerLabel>
                                <AcceptedWorkerName>
                                    {acceptedWorkerName}
                                </AcceptedWorkerName>
                            </AcceptedWorkerInfo>
                        )}
                        {requestReason && (
                            <ReasonInfo>
                                <ReasonLabel>
                                    요청 사유
                                </ReasonLabel>
                                <ReasonText>
                                    {requestReason}
                                </ReasonText>
                            </ReasonInfo>
                        )}
                    </InfoSection>
                </CardContent>
                {canAccept && canReject && (
                    <ButtonGroup>
                        <AcceptButton
                            onClick={handleAcceptClick}
                        >
                            수락
                        </AcceptButton>
                        <RejectButton
                            onClick={handleRejectClick}
                        >
                            거절
                        </RejectButton>
                    </ButtonGroup>
                )}
            </CardContainer>

            <ConfirmModal
                isOpen={showModal}
                onClose={handleModalCancel}
                onConfirm={handleModalConfirm}
                title={
                    modalType === 'accept'
                        ? '대타 요청 수락'
                        : '대타 요청 거절'
                }
                message={
                    modalType === 'accept'
                        ? `${requesterName}님의 대타 요청을 수락하시겠습니까?`
                        : `${requesterName}님의 대타 요청을 거절하시겠습니까?`
                }
                confirmText={
                    modalType === 'accept'
                        ? '수락하기'
                        : '거절하기'
                }
                cancelText='취소'
                confirmColor={
                    modalType === 'accept'
                        ? '#2de283'
                        : '#ef4444'
                }
            />
        </>
    );
};

export default OwnerSubstituteRequestCard;

const CardContainer = styled.div`
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #e0e0e0;
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
`;

const ScheduleInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const ScheduleDate = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const ScheduleTime = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const StatusBadge = styled.div`
    padding: 4px 8px;
    border-radius: 6px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: ${(props) => props.$color};
    background: ${(props) => props.$bgColor};
    border: 1px solid ${(props) => props.$color}20;
    white-space: nowrap;
`;

const PositionTimeRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PositionText = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const TimeInfo = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #999999;
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const InfoSection = styled.div`
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const RequesterInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const RequesterLabel = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #999999;
`;

const RequesterName = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
`;

const AcceptedWorkerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const AcceptedWorkerLabel = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #999999;
`;

const AcceptedWorkerName = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
`;

const ReasonInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ReasonLabel = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #999999;
`;

const ReasonText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

const AcceptButton = styled.button`
    flex: 1;
    padding: 12px 16px;
    background: #2de283;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #25c973;
    }

    &:active {
        background: #1fb865;
    }
`;

const RejectButton = styled.button`
    flex: 1;
    padding: 12px 16px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #dc2626;
    }

    &:active {
        background: #b91c1c;
    }
`;
