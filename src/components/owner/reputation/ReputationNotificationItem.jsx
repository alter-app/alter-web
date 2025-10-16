import styled from 'styled-components';
import { useState } from 'react';
import Profile from '../../../assets/icons/applicant/Profile.svg';
import { timeAgo } from '../../../utils/timeUtil';
import { declineReputation } from '../../../services/reputationService';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../shared/ConfirmModal';

const ReputationNotificationItem = ({
    id,
    requester,
    target,
    createdAt,
}) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleAccept = () => {
        navigate('/reputation-write', {
            state: { requestId: id },
        });
    };

    const handleDeclineClick = () => {
        setShowModal(true);
    };

    const handleModalConfirm = async () => {
        try {
            await declineReputation(id);
            setShowModal(false);
            // 성공 시 페이지 새로고침 또는 목록에서 제거
            window.location.reload();
        } catch (error) {
            console.error('평판 거절 오류:', error);
            alert(error.message);
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
                        {target.name}
                    </WorkplaceName>
                    <TimeAgo>{timeAgo(createdAt)}</TimeAgo>
                </TopSection>
                <InfoGroup>
                    <img src={Profile} alt='이름' />
                    <Name>{requester.name}</Name>
                </InfoGroup>
                <ButtonSection>
                    <AcceptButton onClick={handleAccept}>
                        수락
                    </AcceptButton>
                    <RejectButton
                        onClick={handleDeclineClick}
                    >
                        거절
                    </RejectButton>
                </ButtonSection>
            </ReputationContainer>

            <ConfirmModal
                isOpen={showModal}
                onClose={handleModalCancel}
                onConfirm={handleModalConfirm}
                title='평판 요청 거절'
                message={`${requester.name}님의 평판 요청을 거절하시겠습니까?`}
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
    gap: 8px;
`;

const Name = styled.span`
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
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
