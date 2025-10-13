import styled from 'styled-components';
import { useState } from 'react';
import { formatNumber } from '../../../utils/formatNumber';
import ConfirmModal from '../../shared/ConfirmModal';

const ApplicationCard = ({
    workplaceName,
    status,
    position,
    wage,
    applicationDate,
    onClick,
    onCancel,
}) => {
    const [showModal, setShowModal] = useState(false);
    const getStatusInfo = (status) => {
        // status가 객체인 경우 value와 description 추출
        const statusValue =
            typeof status === 'object'
                ? status.value
                : status;
        const statusDescription =
            typeof status === 'object'
                ? status.description
                : status;

        switch (statusValue) {
            case 'SUBMITTED':
                return {
                    text: statusDescription || '제출됨',
                    color: '#666666',
                };
            case 'SHORTLISTED':
                return {
                    text: statusDescription || '서류 통과',
                    color: '#ffa726',
                };
            case 'ACCEPTED':
                return {
                    text: statusDescription || '수락됨',
                    color: '#2de283',
                };
            case 'REJECTED':
                return {
                    text: statusDescription || '거절됨',
                    color: '#ff4444',
                };
            case 'CANCELLED':
                return {
                    text: statusDescription || '지원 취소',
                    color: '#999999',
                };
            case 'EXPIRED':
                return {
                    text: statusDescription || '기간 만료',
                    color: '#999999',
                };
            case 'DELETED':
                return {
                    text: statusDescription || '삭제됨',
                    color: '#999999',
                };
            default:
                return {
                    text:
                        statusDescription ||
                        statusValue ||
                        status,
                    color: '#666666',
                };
        }
    };

    const statusInfo = getStatusInfo(status);

    // 취소 가능한 상태 확인
    const canCancel =
        status === 'SUBMITTED' ||
        (typeof status === 'object' &&
            status.value === 'SUBMITTED');

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
            <CardContainer onClick={onClick}>
                <CardHeader>
                    <WorkplaceName>
                        {workplaceName}
                    </WorkplaceName>
                    {canCancel && onCancel && (
                        <CancelButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelClick();
                            }}
                            title='지원 취소'
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
                    <SubtitleText>{position}</SubtitleText>
                </CardSubtitle>
                <CardFooter>
                    <ApplicationDate>
                        {applicationDate}
                    </ApplicationDate>
                    <StatusBadge $color={statusInfo.color}>
                        {statusInfo.text}
                    </StatusBadge>
                </CardFooter>
            </CardContainer>

            <ConfirmModal
                isOpen={showModal}
                onClose={handleModalCancel}
                onConfirm={handleModalConfirm}
                title='지원 취소'
                message={`${workplaceName}에 대한 지원을 취소하시겠습니까?`}
                confirmText='취소하기'
                cancelText='아니오'
                confirmColor='#ff4444'
            />
        </>
    );
};

export default ApplicationCard;

const CardContainer = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
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

const ApplicationDate = styled.span`
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
    color: #ffffff;
    background: ${(props) => props.$color};
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
