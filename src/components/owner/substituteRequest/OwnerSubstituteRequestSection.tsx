import styled from 'styled-components';
import OwnerSubstituteRequestCard from './OwnerSubstituteRequestCard';

interface SubstituteRequest {
    schedule?: {
        scheduleId?: string | number;
        startDateTime?: string;
        endDateTime?: string;
        position?: string;
        [key: string]: unknown;
    };
    requester?: {
        workerName?: string;
        [key: string]: unknown;
    };
    requestType?: {
        value?: string;
        [key: string]: unknown;
    };
    acceptedWorker?: {
        workerName?: string;
        [key: string]: unknown;
    };
    status?: {
        value?: string;
        description?: string;
        [key: string]: unknown;
    };
    requestReason?: string;
    createdAt?: string;
    acceptedAt?: string;
    processedAt?: string;
    [key: string]: unknown;
}

interface OwnerSubstituteRequestSectionProps {
    substituteRequests: SubstituteRequest[];
    onViewAllClick?: () => void;
    onAccept?: (request: SubstituteRequest) => void;
    onReject?: (request: SubstituteRequest) => void;
}

const OwnerSubstituteRequestSection = ({
    substituteRequests,
    onViewAllClick,
    onAccept,
    onReject,
}: OwnerSubstituteRequestSectionProps) => {
    return (
        <Section>
            <SectionCard>
                <SectionHeader>
                    <HeaderText>대타 요청 관리</HeaderText>
                </SectionHeader>
                <CardList>
                    {substituteRequests.length > 0 ? (
                        substituteRequests.map(
                            (request: SubstituteRequest, index: number) => (
                                <OwnerSubstituteRequestCard
                                    key={index}
                                    substituteRequestId={(request as { id?: string | number }).id || index}
                                    scheduleId={
                                        request.schedule
                                            ?.scheduleId || index
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
