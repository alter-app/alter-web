import styled from 'styled-components';
import { useState } from 'react';
import Profile from '../../../assets/icons/applicant/Profile.svg';
import { timeAgo } from '../../../utils/timeUtil';
import { declineReputation } from '../../../services/reputationService';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../shared/ConfirmModal';

interface ReputationNotificationItemProps {
    id: string | number;
    workspaceName?: string;
    targetName?: string;
    timeAgo?: string;
    status?: {
        value?: string;
        description?: string;
        [key: string]: unknown;
    };
    onAccept?: () => void;
    onReject?: () => void;
}

const ReputationNotificationItem = ({
    id,
    workspaceName,
    targetName,
    timeAgo: timeAgoText,
    status,
    onAccept,
    onReject,
}: ReputationNotificationItemProps) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // 상태별 색상 및 스타일 설정
    const getStatusConfig = () => {
        if (!status) return null;

        switch (status.value) {
            case 'REQUESTED':
                return {
                    color: '#2de283',
                    bgColor: '#f0fdf4',
                    label: '요청됨',
                };
            case 'COMPLETED':
                return {
                    color: '#3b82f6',
                    bgColor: '#eff6ff',
                    label: '완료됨',
                };
            case 'DECLINED':
                return {
                    color: '#ef4444',
                    bgColor: '#fef2f2',
                    label: '거절됨',
                };
            case 'EXPIRED':
                return {
                    color: '#6b7280',
                    bgColor: '#f9fafb',
                    label: '만료됨',
                };
            case 'CANCELED':
                return {
                    color: '#6b7280',
                    bgColor: '#f9fafb',
                    label: '취소됨',
                };
            default:
                return null;
        }
    };

    const statusConfig = getStatusConfig();
    const isRequested = status?.value === 'REQUESTED';

    const handleAccept = () => {
        if (onAccept) {
            onAccept();
        } else {
            navigate('/reputation-write', {
                state: { requestId: id },
            });
        }
    };

    const handleDeclineClick = () => {
        setShowModal(true);
    };

    const handleModalConfirm = async () => {
        try {
            if (onReject) {
                onReject();
            } else {
                await declineReputation(id);
                window.location.reload();
            }
            setShowModal(false);
        } catch (error: unknown) {
            const err = error as { message?: string };
            console.error('평판 거절 오류:', error);
            alert(err.message || '평판 거절 중 오류가 발생했습니다.');
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <ReputationContainer>
                <TopSection>
                    <WorkplaceName>
                        {workspaceName}
                    </WorkplaceName>
                    <TimeAgo>{timeAgoText}</TimeAgo>
                </TopSection>
                <InfoGroup>
                    <NameGroup>
                        <img src={Profile} alt='이름' />
                        <Name>{targetName}</Name>
                    </NameGroup>
                    {statusConfig && (
                        <StatusBadge
                            $color={statusConfig.color}
                            $bgColor={statusConfig.bgColor}
                        >
                            {statusConfig.label}
                        </StatusBadge>
                    )}
                </InfoGroup>
                {isRequested && (
                    <ButtonSection>
                        <AcceptButton
                            onClick={handleAccept}
                        >
                            수락
                        </AcceptButton>
                        <RejectButton
                            onClick={handleDeclineClick}
                        >
                            거절
                        </RejectButton>
                    </ButtonSection>
                )}
            </ReputationContainer>

            <ConfirmModal
                isOpen={showModal}
                onClose={handleModalCancel}
                onConfirm={handleModalConfirm}
                title='평판 요청 거절'
                message={`${targetName}님의 평판 요청을 거절하시겠습니까?`}
                confirmText='거절하기'
                cancelText='취소'
                confirmColor='#ff4444'
            />
        </>
    );
};

export default ReputationNotificationItem;

const ReputationContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: #2de283;
    }

    &:active {
        transform: translateY(0);
    }
`;

const TopSection = styled.div`
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
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
`;

const InfoGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`;

const NameGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Name = styled.span`
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
`;

interface StatusBadgeProps {
    $color?: string;
    $bgColor?: string;
}

const StatusBadge = styled.div<StatusBadgeProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 13px;
    color: ${(props) => props.$color || '#333333'};
    background: ${(props) => props.$bgColor || '#f0f0f0'};
    border: 1px solid ${(props) => props.$color || '#333333'};
    width: fit-content;
`;

const ButtonSection = styled.div`
    display: flex;
    gap: 8px;
    justify-content: space-between;
    width: 100%;
`;

const AcceptButton = styled.button`
    flex: 1;
    padding: 8px 16px;
    background: #2de283;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
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

const RejectButton = styled.button`
    flex: 1;
    padding: 8px 16px;
    background: #ffffff;
    color: #666666;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #ff4444;
        color: #ff4444;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;
