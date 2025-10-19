import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import ReputationNotificationItem from '../../components/owner/reputation/ReputationNotificationItem';
import { getManagerReputationRequests } from '../../services/managerPage';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';

const ReputationNotificationListPage = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialRequests = async () => {
            try {
                setIsLoading(true);

                const result = await getManagerReputationRequests({
                    cursorInfo: '',
                    pageSize: 10,
                });

                const requestsData = result.data || [];
                const newCursorInfo = result.page?.cursor || '';

                setRequests(requestsData);
                setCursorInfo(newCursorInfo);
                setTotalCount(result.page?.totalCount || 0);

                // 데이터가 10개 미만이거나 cursorInfo가 없으면 더 이상 데이터가 없음
                setHasMore(requestsData.length >= 10 && newCursorInfo !== '');
            } catch (error) {
                console.error('받은 평판 요청 목록 조회 실패:', error);
                setRequests([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialRequests();
    }, []);

    // 더 많은 데이터 로드
    const fetchMoreRequests = useCallback(async () => {
        if (!hasMore || !cursorInfo) return;

        try {
            const result = await getManagerReputationRequests({
                cursorInfo,
                pageSize: 10,
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
    }, [hasMore, cursorInfo]);

    const handleAccept = (request) => {
        try {
            console.log('평판 수락:', request);
            // 평판 작성 페이지로 이동
            navigate('/reputation-write', {
                state: { requestId: request.id },
            });
        } catch (error) {
            console.error('평판 수락 오류:', error);
            alert('평판 수락 중 오류가 발생했습니다.');
        }
    };

    const handleReject = async (request) => {
        try {
            console.log('평판 거절:', request);
            // TODO: 거절 API 호출
            // await declineReputation(request.id);

            // 성공 시 목록에서 제거
            setRequests((prev) => prev.filter((req) => req.id !== request.id));
            setTotalCount((prev) => prev - 1);

            alert('평판이 거절되었습니다.');
        } catch (error) {
            console.error('평판 거절 오류:', error);
            alert('평판 거절 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='평판 알림' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='평판 알림' />
            <ContentContainer>
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
                                    <ReputationNotificationItem
                                        key={request.id}
                                        id={request.id}
                                        workspaceName={
                                            request.workspace?.businessName ||
                                            '업장 정보 없음'
                                        }
                                        targetName={
                                            request.requester?.name ||
                                            '알 수 없음'
                                        }
                                        timeAgo={timeAgo(request.createdAt)}
                                        onAccept={() => handleAccept(request)}
                                        onReject={() => handleReject(request)}
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
                                    d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <path
                                    d='M13.73 21a2 2 0 0 1-3.46 0'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </EmptyIcon>
                        <EmptyTitle>받은 평판 요청이 없습니다</EmptyTitle>
                        <EmptyDescription>
                            아직 받은 평판 요청이 없습니다.
                            <br />
                            근무를 완료하면 평판을 받을 수 있습니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default ReputationNotificationListPage;

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
