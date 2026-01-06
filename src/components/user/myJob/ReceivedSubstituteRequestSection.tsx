import styled from 'styled-components';
import ReceivedSubstituteRequestCard from './ReceivedSubstituteRequestCard';

const ReceivedSubstituteRequestSection = ({
    receivedSubstituteRequests,
    onViewAllClick,
    onAccept,
    onReject,
}) => {
    const receiveIcon = (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );

    return (
        <Section>
            <SectionCard>
                <SectionHeader>
                    {receiveIcon}
                    <HeaderText>받은 대타 요청</HeaderText>
                </SectionHeader>
                <CardList>
                    {receivedSubstituteRequests.length >
                    0 ? (
                        receivedSubstituteRequests.map(
                            (request, index) => (
                                <ReceivedSubstituteRequestCard
                                    key={index}
                                    workspaceName={
                                        request.workspaceName
                                    }
                                    requesterName={
                                        request.requesterName
                                    }
                                    scheduleDate={
                                        request.scheduleDate
                                    }
                                    scheduleTime={
                                        request.scheduleTime
                                    }
                                    position={
                                        request.position
                                    }
                                    timeAgo={
                                        request.timeAgo
                                    }
                                    status={request.status}
                                    statusDescription={
                                        request.statusDescription
                                    }
                                    requestReason={
                                        request.requestReason
                                    }
                                    onAccept={() =>
                                        onAccept &&
                                        onAccept(request)
                                    }
                                    onReject={() =>
                                        onReject &&
                                        onReject(request)
                                    }
                                />
                            )
                        )
                    ) : (
                        <EmptyMessage>
                            받은 대타 요청이 없습니다
                        </EmptyMessage>
                    )}
                </CardList>
                <ViewAllButton onClick={onViewAllClick}>
                    전체 받은 대타 요청 보기
                </ViewAllButton>
            </SectionCard>
        </Section>
    );
};

export default ReceivedSubstituteRequestSection;

const Section = styled.div`
    margin-bottom: 20px;
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    svg {
        flex-shrink: 0;
    }
`;

const HeaderText = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
`;

const EmptyMessage = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    text-align: center;
    padding: 20px;
`;

const ViewAllButton = styled.button`
    width: 100%;
    padding: 12px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #e9ecef;
        border-color: #dee2e6;
    }

    &:active {
        background: #dee2e6;
    }
`;
