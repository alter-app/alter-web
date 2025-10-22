import styled from 'styled-components';
import { useState } from 'react';
import ConfirmModal from '../../shared/ConfirmModal';

const ReceivedSubstituteRequestCard = ({
    workspaceName,
    requesterName,
    scheduleDate,
    scheduleTime,
    position,
    timeAgo,
    status,
    statusDescription,
    requestReason,
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
                    bgColor: '#f9fafb',
                    text: statusDescription || '알 수 없음',
                };
        }
    };

    const statusInfo = getStatusInfo();
    const canAccept = status === 'PENDING';
    const canReject = status === 'PENDING';

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
                    <WorkplaceName>
                        {workspaceName}
                    </WorkplaceName>
                    <StatusBadge
                        $color={statusInfo.color}
                        $bgColor={statusInfo.bgColor}
                    >
                        {statusInfo.text}
                    </StatusBadge>
                </CardHeader>
                <CardSubtitle>
                    <ScheduleText>
                        <DateText>{scheduleDate}</DateText>
                        <Separator>·</Separator>
                        <TimeText>{scheduleTime}</TimeText>
                    </ScheduleText>
                    <PositionText>{position}</PositionText>
                </CardSubtitle>
                <CardContent>
                    <RequesterInfo>
                        <RequesterLabel>
                            요청자
                        </RequesterLabel>
                        <RequesterName>
                            {requesterName}
                        </RequesterName>
                    </RequesterInfo>
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
                </CardContent>
                <CardFooter>
                    <TimeAgo>{timeAgo}</TimeAgo>
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
                </CardFooter>
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
                        ? `${workspaceName}에서 받은 대타 요청을 수락하시겠습니까?`
                        : `${workspaceName}에서 받은 대타 요청을 거절하시겠습니까?`
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

export default ReceivedSubstituteRequestCard;

const CardContainer = styled.div`
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #e0e0e0;
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const CardSubtitle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
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

const CardContent = styled.div`
    margin-bottom: 12px;
`;

const RequesterInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
`;

const RequesterLabel = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 13px;
    color: #666666;
`;

const RequesterName = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
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
    font-weight: 500;
    font-size: 13px;
    color: #666666;
`;

const ReasonText = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    line-height: 1.4;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0;
    flex: 1;
`;

const TimeAgo = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #999999;
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
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

const AcceptButton = styled.button`
    padding: 6px 12px;
    background: #2de283;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
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
    padding: 6px 12px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #dc2626;
    }

    &:active {
        background: #b91c1c;
    }
`;
