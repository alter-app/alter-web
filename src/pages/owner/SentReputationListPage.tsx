import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import SentReputationCard from '../../components/user/myJob/SentReputationCard';
import SentReputationStatusFilter from '../../components/user/myJob/SentReputationStatusFilter';
import {
    getSentReputationRequests,
    cancelReputationRequest,
} from '../../services/managerPage';
import Loader from '../../components/Loader';
import { timeAgo } from '../../utils/timeUtil';

const SentReputationListPage = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [cursorInfo, setCursorInfo] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialRequests = async () => {
            try {
                setIsLoading(true);

                const result = await getSentReputationRequests({
                    cursorInfo: '',
                    status: selectedStatuses,
                });

                const requestsData = result.data || [];
                const newCursorInfo = result.page?.cursor || '';

                setRequests(requestsData);
                setCursorInfo(newCursorInfo);
                setTotalCount(result.page?.totalCount || 0);

                // 데이터가 10개 미만이거나 cursorInfo가 없으면 더 이상 데이터가 없음
                setHasMore(requestsData.length >= 10 && newCursorInfo !== '');
            } catch (error) {
                console.error('보낸 평판 요청 목록 조회 실패:', error);
                setRequests([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialRequests();
    }, [selectedStatuses]);

    // 더 많은 데이터 로드
    const fetchMoreRequests = useCallback(async () => {
        if (!hasMore || !cursorInfo) return;

        try {
            const result = await getSentReputationRequests({
                cursorInfo,
                status: selectedStatuses,
            });

            const newRequests = result.data || [];
            const newCursorInfo = result.page?.cursor || '';

            setRequests((prev) => [...prev, ...newRequests]);
            setCursorInfo(newCursorInfo);

            // 데이터가 10개 미만이거나 cursorInfo가 없으면 더 이상 데이터가 없음
            setHasMore(newRequests.length >= 10 && newCursorInfo !== '');
        } catch (error) {
            console.error('추가 평판 요청 목록 조회 실패:', error);
            setHasMore(false);
        }
    }, [hasMore, cursorInfo, selectedStatuses]);

    const handleCancelRequest = async (request) => {
        try {
            console.log('보낸 평판 취소:', request);
            await cancelReputationRequest(request.id);

            // 최신 데이터 다시 가져오기
            const result = await getSentReputationRequests({
                cursorInfo: '',
                status: selectedStatuses,
            });

            const requestsData = result.data || [];
            const newCursorInfo = result.page?.cursor || '';

            setRequests(requestsData);
            setCursorInfo(newCursorInfo);
            setTotalCount(result.page?.totalCount || 0);

            // 데이터가 10개 미만이거나 cursorInfo가 없으면 더 이상 데이터가 없음
            setHasMore(requestsData.length >= 10 && newCursorInfo !== '');
        } catch (error) {
            console.error('보낸 평판 취소 오류:', error);
            alert('평판 취소 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='보낸 평판 요청' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='보낸 평판 요청' />
            <ContentContainer>
                <FilterWrapper>
                    <TotalCountText>
                        총 <TotalCount>{totalCount}</TotalCount>건
                    </TotalCountText>
                    <SentReputationStatusFilter
                        selectedStatuses={selectedStatuses}
                        onStatusChange={setSelectedStatuses}
                    />
                </FilterWrapper>

                {requests.length > 0 ? (
                    <InfiniteScroll
                        dataLength={requests.length}
                        next={fetchMoreRequests}
                        hasMore={hasMore}
                        loader={
                            <LoadingContainer>
                                <Loader />
                            </LoadingContainer>
                        }
                    >
                        <SectionCard>
                            <RequestList>
                                {requests.map((request) => (
                                    <SentReputationCard
                                        key={request.id}
                                        targetName={
                                            request.target?.name || '알 수 없음'
                                        }
                                        workplaceName={
                                            request.requester?.name ||
                                            '업장 정보 없음'
                                        }
                                        timeAgo={timeAgo(request.createdAt)}
                                        status={request.status.value}
                                        statusDescription={
                                            request.status.description
                                        }
                                        onCancel={() =>
                                            handleCancelRequest(request)
                                        }
                                    />
                                ))}
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
                                    d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <polyline
                                    points='14,2 14,8 20,8'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <line
                                    x1='16'
                                    y1='13'
                                    x2='8'
                                    y2='13'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <line
                                    x1='16'
                                    y1='17'
                                    x2='8'
                                    y2='17'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </EmptyIcon>
                        <EmptyTitle>보낸 평판 요청이 없습니다</EmptyTitle>
                        <EmptyDescription>
                            아직 보낸 평판 요청이 없습니다.
                            <br />
                            평판을 요청하고 응답을 기다려보세요.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default SentReputationListPage;

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
    background: transparent;
    border-radius: 16px;
    padding: 0;
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
