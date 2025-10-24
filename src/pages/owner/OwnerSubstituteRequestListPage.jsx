import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import OwnerSubstituteRequestCard from '../../components/owner/substituteRequest/OwnerSubstituteRequestCard';
import OwnerSubstituteRequestStatusFilter from '../../components/owner/substituteRequest/OwnerSubstituteRequestStatusFilter';
import {
    getOwnerSubstituteRequests,
    approveOwnerSubstituteRequest,
    rejectOwnerSubstituteRequest,
} from '../../services/ownerSubstituteRequest';
import Loader from '../../components/Loader';
const OwnerSubstituteRequestListPage = () => {
    const [substituteRequests, setSubstituteRequests] =
        useState([]);
    const [selectedStatuses, setSelectedStatuses] =
        useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // 대타 요청 목록 조회
    const fetchSubstituteRequests = useCallback(
        async (cursor = null, isLoadMore = false) => {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            try {
                const response =
                    await getOwnerSubstituteRequests(
                        10, // pageSize
                        cursor,
                        selectedStatuses.length > 0
                            ? selectedStatuses[0]
                            : null
                    );

                const newRequests =
                    response.data?.data || [];

                if (isLoadMore) {
                    setSubstituteRequests((prev) => [
                        ...prev,
                        ...newRequests,
                    ]);
                } else {
                    setSubstituteRequests(newRequests);
                }

                setNextCursor(
                    response.data?.page?.cursor || null
                );
                setHasMore(!!response.data?.page?.cursor);
                setTotalCount(
                    response.data?.page?.totalCount || 0
                );
            } catch (error) {
                console.error(
                    '대타 요청 목록 조회 실패:',
                    error
                );
                if (!isLoadMore) {
                    setSubstituteRequests([]);
                }
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [selectedStatuses]
    );

    // 초기 데이터 로드 및 상태 필터 변경 시 데이터 다시 로드
    useEffect(() => {
        fetchSubstituteRequests();
    }, [fetchSubstituteRequests]);

    // 더 많은 데이터 로드
    const loadMoreData = useCallback(() => {
        if (nextCursor && !isLoadingMore) {
            fetchSubstituteRequests(nextCursor, true);
        }
    }, [
        nextCursor,
        isLoadingMore,
        fetchSubstituteRequests,
    ]);

    // 대타 요청 승인
    const handleAccept = async (request) => {
        try {
            await approveOwnerSubstituteRequest(
                request.id,
                '승인합니다'
            );
            // 성공 시 목록에서 제거하거나 상태 업데이트
            setSubstituteRequests((prev) =>
                prev.filter((req) => req.id !== request.id)
            );
            console.log('대타 요청 승인 완료:', request);
        } catch (error) {
            console.error('대타 요청 승인 실패:', error);
            // 에러 처리 (토스트 메시지 등)
        }
    };

    // 대타 요청 거절
    const handleReject = async (request) => {
        try {
            await rejectOwnerSubstituteRequest(
                request.id,
                '승인 불가'
            );
            // 성공 시 목록에서 제거하거나 상태 업데이트
            setSubstituteRequests((prev) =>
                prev.filter((req) => req.id !== request.id)
            );
            console.log('대타 요청 거절 완료:', request);
        } catch (error) {
            console.error('대타 요청 거절 실패:', error);
            // 에러 처리 (토스트 메시지 등)
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='대타 요청 관리' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='대타 요청 관리' />
            <ContentContainer>
                <FilterWrapper>
                    <TotalCountText>
                        총{' '}
                        <TotalCount>
                            {totalCount}
                        </TotalCount>
                        건
                    </TotalCountText>
                    <OwnerSubstituteRequestStatusFilter
                        selectedStatuses={selectedStatuses}
                        onStatusChange={setSelectedStatuses}
                    />
                </FilterWrapper>
                {substituteRequests.length > 0 ? (
                    <InfiniteScroll
                        dataLength={
                            substituteRequests.length
                        }
                        next={loadMoreData}
                        hasMore={hasMore}
                        loader={
                            isLoadingMore ? (
                                <LoadingContainer>
                                    <Loader />
                                </LoadingContainer>
                            ) : null
                        }
                        endMessage={
                            substituteRequests.length >
                            0 ? (
                                <EndMessage>
                                    모든 대타 요청을
                                    불러왔습니다.
                                </EndMessage>
                            ) : null
                        }
                    >
                        <SectionCard>
                            <RequestList>
                                {substituteRequests.map(
                                    (request, index) => (
                                        <OwnerSubstituteRequestCard
                                            key={
                                                request.id ||
                                                index
                                            }
                                            substituteRequestId={
                                                request.id
                                            }
                                            scheduleId={
                                                request
                                                    .schedule
                                                    ?.scheduleId
                                            }
                                            startDateTime={
                                                request
                                                    .schedule
                                                    ?.startDateTime
                                            }
                                            endDateTime={
                                                request
                                                    .schedule
                                                    ?.endDateTime
                                            }
                                            position={
                                                request
                                                    .schedule
                                                    ?.position
                                            }
                                            requesterName={
                                                request
                                                    .requester
                                                    ?.workerName
                                            }
                                            requestType={
                                                request
                                                    .requestType
                                                    ?.value
                                            }
                                            acceptedWorkerName={
                                                request
                                                    .acceptedWorker
                                                    ?.workerName
                                            }
                                            status={
                                                request
                                                    .status
                                                    ?.value
                                            }
                                            statusDescription={
                                                request
                                                    .status
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
                                                handleAccept(
                                                    request
                                                )
                                            }
                                            onReject={() =>
                                                handleReject(
                                                    request
                                                )
                                            }
                                        />
                                    )
                                )}
                            </RequestList>
                        </SectionCard>
                    </InfiniteScroll>
                ) : (
                    <EmptyContainer>
                        <EmptyIcon>
                            <svg
                                width='48'
                                height='48'
                                viewBox='0 0 24 24'
                                fill='none'
                            >
                                <path
                                    d='M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <path
                                    d='M12 16L13.09 22.26L22 23L13.09 23.74L12 30L10.91 23.74L2 23L10.91 22.26L12 16Z'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </EmptyIcon>
                        <EmptyTitle>
                            대타 요청이 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            아직 대타 요청이 없습니다.
                            <br />
                            근무자들이 대타 요청을 하면
                            여기에 표시됩니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default OwnerSubstituteRequestListPage;

const PageContainer = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
    padding-top: 60px;
`;

const ContentContainer = styled.div`
    padding: 12px;
    padding-top: 20px;
`;

const FilterWrapper = styled.div`
    margin-bottom: 16px;
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
`;

const TotalCountText = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    margin-bottom: 12px;

    @media (max-width: 480px) {
        font-size: 13px;
    }
`;

const TotalCount = styled.span`
    font-weight: 600;
    color: #333333;
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const RequestList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const EndMessage = styled.div`
    text-align: center;
    padding: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #999999;
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
`;

const EmptyIcon = styled.div`
    margin-bottom: 16px;
    opacity: 0.6;
`;

const EmptyTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 1.5;
    margin: 0;
`;
