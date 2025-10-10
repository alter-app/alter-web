import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import ReputationCard from '../../components/user/myJob/ReputationCard';
import {
    getUserReputationRequestsList,
    userDeclineReputation,
} from '../../services/myJob';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';

const ReputationListPage = () => {
    const [reputations, setReputations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const navigate = useNavigate();

    // 데이터 변환 함수
    const transformReputationData = (data) => {
        return (data || []).map((item) => ({
            id: item.id,
            workplaceName:
                item.workplaceName ||
                item.target?.name ||
                '알 수 없는 업장',
            reviewerName:
                item.requesterName ||
                item.requester?.name ||
                '알 수 없는 요청자',
            timeAgo: item.createdAt
                ? timeAgo(item.createdAt)
                : '알 수 없음',
            rating: item.rating || 0,
            isNew: item.isNew || false,
        }));
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialReputations = async () => {
            try {
                setIsLoading(true);

                const reputationData =
                    await getUserReputationRequestsList(20);
                const formattedReputations =
                    transformReputationData(
                        reputationData.data
                    );

                setReputations(formattedReputations);
                setNextCursor(
                    reputationData.page?.cursor || null
                );
                setHasMore(!!reputationData.page?.cursor);
            } catch (error) {
                console.error(
                    '평판 목록 조회 실패:',
                    error
                );
                setReputations([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialReputations();
    }, []);

    // 더 많은 데이터 로드
    const fetchMoreReputations = useCallback(async () => {
        if (!hasMore || isLoadingMore || !nextCursor)
            return;

        try {
            setIsLoadingMore(true);

            const reputationData =
                await getUserReputationRequestsList(
                    20,
                    nextCursor
                );
            const newReputations = transformReputationData(
                reputationData.data
            );

            setReputations((prev) => [
                ...prev,
                ...newReputations,
            ]);
            setNextCursor(
                reputationData.page?.cursor || null
            );
            setHasMore(!!reputationData.page?.cursor);
        } catch (error) {
            console.error(
                '추가 평판 목록 조회 실패:',
                error
            );
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasMore, isLoadingMore, nextCursor]);

    const handleAccept = (reputation) => {
        try {
            console.log('평판 수락:', reputation);
            // 평판 작성 페이지로 이동
            navigate('/reputation-write', {
                state: { requestId: reputation.id },
            });
        } catch (error) {
            console.error('평판 수락 오류:', error);
            alert('평판 수락 중 오류가 발생했습니다.');
        }
    };

    const handleReject = async (reputation) => {
        try {
            console.log('평판 거절:', reputation);
            await userDeclineReputation(reputation.id);

            // 성공 시 목록에서 제거
            setReputations((prev) =>
                prev.filter(
                    (rep) => rep.id !== reputation.id
                )
            );

            alert('평판이 거절되었습니다.');
        } catch (error) {
            console.error('평판 거절 오류:', error);
            alert('평판 거절 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='받은 평판' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='받은 평판' />
            <ContentContainer>
                {reputations.length > 0 ? (
                    <InfiniteScroll
                        dataLength={reputations.length}
                        next={fetchMoreReputations}
                        hasMore={hasMore}
                        loader={
                            <LoadingContainer>
                                <Loader />
                            </LoadingContainer>
                        }
                    >
                        <SectionCard>
                            <ReputationList>
                                {reputations.map(
                                    (reputation) => (
                                        <ReputationCard
                                            key={
                                                reputation.id
                                            }
                                            workplaceName={
                                                reputation.workplaceName
                                            }
                                            reviewerName={
                                                reputation.reviewerName
                                            }
                                            timeAgo={
                                                reputation.timeAgo
                                            }
                                            rating={
                                                reputation.rating
                                            }
                                            isNew={
                                                reputation.isNew
                                            }
                                            onAccept={() =>
                                                handleAccept(
                                                    reputation
                                                )
                                            }
                                            onReject={() =>
                                                handleReject(
                                                    reputation
                                                )
                                            }
                                        />
                                    )
                                )}
                            </ReputationList>
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
                        <EmptyTitle>
                            받은 평판이 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            아직 받은 평판 요청이 없습니다.
                            <br />
                            근무를 완료하면 평판을 받을 수
                            있습니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default ReputationListPage;

const PageContainer = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
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

const ReputationList = styled.div`
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

const LoadingText = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
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

const EndMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
    text-align: center;
`;
