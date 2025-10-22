import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import ReceivedSubstituteRequestCard from '../../components/user/myJob/ReceivedSubstituteRequestCard';
import ReceivedSubstituteRequestStatusFilter from '../../components/user/myJob/ReceivedSubstituteRequestStatusFilter';
import { getReceivedSubstituteRequests } from '../../services/scheduleRequest';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';

const ReceivedSubstituteRequestListPage = () => {
    const [
        receivedSubstituteRequests,
        setReceivedSubstituteRequests,
    ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [selectedStatuses, setSelectedStatuses] =
        useState([]);
    const navigate = useNavigate();

    // 데이터 변환 함수
    const transformReceivedSubstituteRequestData = (
        data
    ) => {
        return (data || []).map((item) => {
            const startDate = new Date(
                item.schedule.startDateTime
            );
            const endDate = new Date(
                item.schedule.endDateTime
            );

            return {
                id: item.id,
                workspaceName:
                    item.workspace?.workspaceName ||
                    '알 수 없는 업장',
                requesterName:
                    item.requester?.workerName ||
                    '알 수 없는 요청자',
                scheduleDate: startDate.toLocaleDateString(
                    'ko-KR',
                    {
                        month: 'long',
                        day: 'numeric',
                    }
                ),
                scheduleTime: `${startDate.toLocaleTimeString(
                    'ko-KR',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }
                )} ~ ${endDate.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })}`,
                position:
                    item.schedule.position ||
                    '알 수 없는 직책',
                timeAgo: item.createdAt
                    ? timeAgo(item.createdAt)
                    : '알 수 없음',
                status: item.status?.value || 'PENDING',
                statusDescription:
                    item.status?.description || '대기 중',
                requestReason: item.requestReason || '',
            };
        });
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialReceivedSubstituteRequests =
            async () => {
                try {
                    setIsLoading(true);

                    const selectedStatus =
                        selectedStatuses.length > 0
                            ? selectedStatuses[0]
                            : null;
                    const receivedSubstituteRequestData =
                        await getReceivedSubstituteRequests(
                            10,
                            null,
                            selectedStatus
                        );
                    const formattedReceivedSubstituteRequests =
                        transformReceivedSubstituteRequestData(
                            receivedSubstituteRequestData
                                .data?.data || []
                        );

                    setReceivedSubstituteRequests(
                        formattedReceivedSubstituteRequests
                    );
                    setNextCursor(
                        receivedSubstituteRequestData.data
                            ?.page?.cursor || null
                    );
                    setHasMore(
                        formattedReceivedSubstituteRequests.length ===
                            10
                    );
                } catch (error) {
                    console.error(
                        '받은 대타 요청 목록 조회 실패:',
                        error
                    );
                    setReceivedSubstituteRequests([]);
                    setHasMore(false);
                } finally {
                    setIsLoading(false);
                }
            };

        fetchInitialReceivedSubstituteRequests();
    }, [selectedStatuses]);

    // 더 많은 데이터 로드
    const fetchMoreReceivedSubstituteRequests =
        useCallback(async () => {
            if (!nextCursor || isLoadingMore) return;

            try {
                setIsLoadingMore(true);

                const selectedStatus =
                    selectedStatuses.length > 0
                        ? selectedStatuses[0]
                        : null;
                const receivedSubstituteRequestData =
                    await getReceivedSubstituteRequests(
                        10,
                        nextCursor,
                        selectedStatus
                    );
                const formattedReceivedSubstituteRequests =
                    transformReceivedSubstituteRequestData(
                        receivedSubstituteRequestData.data
                            ?.data || []
                    );

                setReceivedSubstituteRequests((prev) => [
                    ...prev,
                    ...formattedReceivedSubstituteRequests,
                ]);
                setNextCursor(
                    receivedSubstituteRequestData.data?.page
                        ?.cursor || null
                );
                setHasMore(
                    formattedReceivedSubstituteRequests.length ===
                        10
                );
            } catch (error) {
                console.error(
                    '받은 대타 요청 추가 조회 실패:',
                    error
                );
                setHasMore(false);
            } finally {
                setIsLoadingMore(false);
            }
        }, [nextCursor, isLoadingMore, selectedStatuses]);

    // 대타 요청 수락
    const handleAccept = async (request) => {
        console.log('대타 요청 수락:', request);
        // TODO: 대타 요청 수락 API 호출
        alert('대타 요청 수락 기능은 준비 중입니다.');
    };

    // 대타 요청 거절
    const handleReject = async (request) => {
        console.log('대타 요청 거절:', request);
        // TODO: 대타 요청 거절 API 호출
        alert('대타 요청 거절 기능은 준비 중입니다.');
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='받은 대타 요청' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='받은 대타 요청' />
            <ContentContainer>
                <ReceivedSubstituteRequestStatusFilter
                    selectedStatuses={selectedStatuses}
                    onStatusChange={setSelectedStatuses}
                />
                {receivedSubstituteRequests.length > 0 ? (
                    <InfiniteScroll
                        dataLength={
                            receivedSubstituteRequests.length
                        }
                        next={
                            fetchMoreReceivedSubstituteRequests
                        }
                        hasMore={hasMore}
                        loader={
                            <LoadingContainer>
                                <Loader />
                            </LoadingContainer>
                        }
                    >
                        <SectionCard>
                            <ReceivedSubstituteRequestList>
                                {receivedSubstituteRequests.map(
                                    (request) => (
                                        <ReceivedSubstituteRequestCard
                                            key={request.id}
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
                                            status={
                                                request.status
                                            }
                                            statusDescription={
                                                request.statusDescription
                                            }
                                            requestReason={
                                                request.requestReason
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
                            </ReceivedSubstituteRequestList>
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
                                    d='M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </EmptyIcon>
                        <EmptyTitle>
                            받은 대타 요청이 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            받은 대타 요청을 보내면 여기에
                            표시됩니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default ReceivedSubstituteRequestListPage;

const PageContainer = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
    padding-top: 60px;
`;

const ContentContainer = styled.div`
    padding: 12px;
    padding-top: 20px;
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const ReceivedSubstituteRequestList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
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
