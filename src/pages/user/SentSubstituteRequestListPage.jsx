import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import SentSubstituteRequestCard from '../../components/user/myJob/SentSubstituteRequestCard';
import { getSentSubstituteRequests } from '../../services/scheduleRequest';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';

const SentSubstituteRequestListPage = () => {
    const [
        sentSubstituteRequests,
        setSentSubstituteRequests,
    ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const navigate = useNavigate();

    // 데이터 변환 함수
    const transformSentSubstituteRequestData = (data) => {
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
            };
        });
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialSentSubstituteRequests =
            async () => {
                try {
                    setIsLoading(true);

                    const sentSubstituteRequestData =
                        await getSentSubstituteRequests(
                            10,
                            null,
                            null
                        );
                    const formattedSentSubstituteRequests =
                        transformSentSubstituteRequestData(
                            sentSubstituteRequestData.data
                                ?.data || []
                        );

                    setSentSubstituteRequests(
                        formattedSentSubstituteRequests
                    );
                    setNextCursor(
                        sentSubstituteRequestData.data?.page
                            ?.cursor || null
                    );
                    setHasMore(
                        formattedSentSubstituteRequests.length ===
                            10
                    );
                } catch (error) {
                    console.error(
                        '보낸 대타 요청 목록 조회 실패:',
                        error
                    );
                    setSentSubstituteRequests([]);
                    setHasMore(false);
                } finally {
                    setIsLoading(false);
                }
            };

        fetchInitialSentSubstituteRequests();
    }, []);

    // 더 많은 데이터 로드
    const fetchMoreSentSubstituteRequests =
        useCallback(async () => {
            if (!nextCursor || isLoadingMore) return;

            try {
                setIsLoadingMore(true);

                const sentSubstituteRequestData =
                    await getSentSubstituteRequests(
                        10,
                        nextCursor,
                        null
                    );
                const formattedSentSubstituteRequests =
                    transformSentSubstituteRequestData(
                        sentSubstituteRequestData.data
                            ?.data || []
                    );

                setSentSubstituteRequests((prev) => [
                    ...prev,
                    ...formattedSentSubstituteRequests,
                ]);
                setNextCursor(
                    sentSubstituteRequestData.data?.page
                        ?.cursor || null
                );
                setHasMore(
                    formattedSentSubstituteRequests.length ===
                        10
                );
            } catch (error) {
                console.error(
                    '보낸 대타 요청 추가 조회 실패:',
                    error
                );
                setHasMore(false);
            } finally {
                setIsLoadingMore(false);
            }
        }, [nextCursor, isLoadingMore]);

    // 대타 요청 취소
    const handleCancel = async (request) => {
        console.log('대타 요청 취소:', request);
        // TODO: 대타 요청 취소 API 호출
        alert('대타 요청 취소 기능은 준비 중입니다.');
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='보낸 대타 요청' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='보낸 대타 요청' />
            <ContentContainer>
                {sentSubstituteRequests.length > 0 ? (
                    <InfiniteScroll
                        dataLength={
                            sentSubstituteRequests.length
                        }
                        next={
                            fetchMoreSentSubstituteRequests
                        }
                        hasMore={hasMore}
                        loader={
                            <LoadingContainer>
                                <Loader />
                            </LoadingContainer>
                        }
                    >
                        <SectionCard>
                            <SentSubstituteRequestList>
                                {sentSubstituteRequests.map(
                                    (request) => (
                                        <SentSubstituteRequestCard
                                            key={request.id}
                                            workspaceName={
                                                request.workspaceName
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
                                            onCancel={() =>
                                                handleCancel(
                                                    request
                                                )
                                            }
                                        />
                                    )
                                )}
                            </SentSubstituteRequestList>
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
                            보낸 대타 요청이 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            대타 요청을 보내면 여기에
                            표시됩니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default SentSubstituteRequestListPage;

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

const SentSubstituteRequestList = styled.div`
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
