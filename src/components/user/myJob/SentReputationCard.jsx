import styled from 'styled-components';
import { useState } from 'react';
import CancelReputationModal from './CancelReputationModal';

const SentReputationCard = ({
    targetName,
    workplaceName,
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
                case 'REQUESTED':
                    return '#2de283';
                case 'COMPLETED':
                    return '#3b82f6';
                case 'DECLINED':
                    return '#ef4444';
                case 'EXPIRED':
                    return '#6b7280';
                case 'CANCELED':
                    return '#6b7280';
                default:
                    return '#6b7280';
            }
        };

        const getStatusBgColor = (statusValue) => {
            switch (statusValue) {
                case 'REQUESTED':
                    return '#f0fdf4';
                case 'COMPLETED':
                    return '#eff6ff';
                case 'DECLINED':
                    return '#fef2f2';
                case 'EXPIRED':
                    return '#f9fafb';
                case 'CANCELED':
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
    const canCancel = status === 'REQUESTED';

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
                        {workplaceName}
                    </WorkplaceName>
                    {canCancel && (
                        <CancelButton
                            onClick={handleCancelClick}
                            title='평판 요청 취소'
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
                    <SubtitleText>
                        {targetName}
                    </SubtitleText>
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

            <CancelReputationModal
                isOpen={showModal}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
                targetName={targetName}
                workplaceName={workplaceName}
            />
        </>
    );
};

export default SentReputationCard;

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
    padding-top: 4px;
`;

const SubtitleText = styled.p`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #767676;
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
