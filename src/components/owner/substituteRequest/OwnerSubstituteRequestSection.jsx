import styled from 'styled-components';
import OwnerSubstituteRequestCard from './OwnerSubstituteRequestCard';

const OwnerSubstituteRequestSection = ({
    substituteRequests,
    onViewAllClick,
    onAccept,
    onReject,
}) => {
    const substituteIcon = (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M12 16L13.09 22.26L22 23L13.09 23.74L12 30L10.91 23.74L2 23L10.91 22.26L12 16Z'
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
                    {substituteIcon}
                    <HeaderText>대타 요청 관리</HeaderText>
                </SectionHeader>
                <CardList>
                    {substituteRequests.length > 0 ? (
                        substituteRequests.map(
                            (request, index) => (
                                <OwnerSubstituteRequestCard
                                    key={index}
                                    scheduleId={
                                        request.schedule
                                            ?.scheduleId
                                    }
                                    startDateTime={
                                        request.schedule
                                            ?.startDateTime
                                    }
                                    endDateTime={
                                        request.schedule
                                            ?.endDateTime
                                    }
                                    position={
                                        request.schedule
                                            ?.position
                                    }
                                    requesterName={
                                        request.requester
                                            ?.workerName
                                    }
                                    requestType={
                                        request.requestType
                                            ?.value
                                    }
                                    acceptedWorkerName={
                                        request
                                            .acceptedWorker
                                            ?.workerName
                                    }
                                    status={
                                        request.status
                                            ?.value
                                    }
                                    statusDescription={
                                        request.status
                                            ?.description
                                    }
                                    requestReason={
                                        request.requestReason
                                    }
                                    createdAt={
                                        request.createdAt
                                    }
                                    acceptedAt={
                                        request.acceptedAt
                                    }
                                    processedAt={
                                        request.processedAt
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
                            대타 요청이 없습니다
                        </EmptyMessage>
                    )}
                </CardList>
                <ViewAllButton
                    onClick={() =>
                        onViewAllClick && onViewAllClick()
                    }
                >
                    전체 대타 요청 보기
                </ViewAllButton>
            </SectionCard>
        </Section>
    );
};

export default OwnerSubstituteRequestSection;

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
