import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import SentReputationCard from '../../components/user/myJob/SentReputationCard';
import SentReputationStatusFilter from '../../components/user/myJob/SentReputationStatusFilter';
import {
    getUserSentReputationRequestsList,
    cancelSentReputationRequest,
} from '../../services/myJob';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';

const SentReputationListPage = () => {
    const [sentReputations, setSentReputations] = useState(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [selectedStatuses, setSelectedStatuses] =
        useState([]);
    const navigate = useNavigate();

    // 데이터 변환 함수
    const transformSentReputationData = (data) => {
        return (data || []).map((item) => {
            let targetName = '알 수 없는 대상';
            let workplaceName = '알 수 없는 업장';

            if (item.target?.type === 'USER') {
                targetName =
                    item.target?.name || '알 수 없는 대상';
                workplaceName =
                    item.workspace?.businessName ||
                    '알 수 없는 업장';
            } else if (item.target?.type === 'WORKSPACE') {
                targetName = '업장';
                workplaceName =
                    item.workspace?.businessName ||
                    '알 수 없는 업장';
            }

            return {
                id: item.id,
                targetName,
                workplaceName,
                timeAgo: item.createdAt
                    ? timeAgo(item.createdAt)
                    : '알 수 없음',
                status: item.status?.value || 'REQUESTED',
                statusDescription:
                    item.status?.description || '요청됨',
            };
        });
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialSentReputations = async () => {
            try {
                setIsLoading(true);

                const sentReputationData =
                    await getUserSentReputationRequestsList(
                        10,
                        null,
                        selectedStatuses.length > 0
                            ? selectedStatuses[0]
                            : null
                    );
                const formattedSentReputations =
                    transformSentReputationData(
                        sentReputationData.data
                    );

                setSentReputations(
                    formattedSentReputations
                );
                setNextCursor(
                    sentReputationData.page?.cursor || null
                );
                setHasMore(
                    formattedSentReputations.length === 20
                );
            } catch (error) {
                console.error(
                    '보낸 평판 목록 조회 실패:',
                    error
                );
                setSentReputations([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialSentReputations();
    }, [selectedStatuses]);

    // 더 많은 데이터 로드
    const fetchMoreSentReputations =
        useCallback(async () => {
            if (!hasMore || isLoadingMore || !nextCursor)
                return;

            try {
                setIsLoadingMore(true);

                const sentReputationData =
                    await getUserSentReputationRequestsList(
                        20,
                        nextCursor,
                        selectedStatuses.length > 0
                            ? selectedStatuses[0]
                            : null
                    );
                const newSentReputations =
                    transformSentReputationData(
                        sentReputationData.data
                    );

                setSentReputations((prev) => [
                    ...prev,
                    ...newSentReputations,
                ]);
                setNextCursor(
                    sentReputationData.page?.cursor || null
                );
                setHasMore(
                    newSentReputations.length === 20
                );
            } catch (error) {
                console.error(
                    '추가 보낸 평판 목록 조회 실패:',
                    error
                );
                setHasMore(false);
            } finally {
                setIsLoadingMore(false);
            }
        }, [
            hasMore,
            isLoadingMore,
            nextCursor,
            selectedStatuses,
        ]);

    const handleCancel = async (reputation) => {
        try {
            console.log('보낸 평판 취소:', reputation);
            await cancelSentReputationRequest(
                reputation.id
            );

            // 최신 데이터 다시 가져오기
            const sentReputationData =
                await getUserSentReputationRequestsList(
                    20,
                    null,
                    selectedStatuses.length > 0
                        ? selectedStatuses.join(',')
                        : null
                );
            const formattedSentReputations =
                transformSentReputationData(
                    sentReputationData.data
                );

            setSentReputations(formattedSentReputations);
            setNextCursor(
                sentReputationData.page?.cursor || null
            );
            setHasMore(
                formattedSentReputations.length === 20
            );
        } catch (error) {
            console.error('보낸 평판 취소 오류:', error);
            alert('평판 취소 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='보낸 평판' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='보낸 평판' />
            <ContentContainer>
                <SentReputationStatusFilter
                    selectedStatuses={selectedStatuses}
                    onStatusChange={setSelectedStatuses}
                />
                {sentReputations.length > 0 ? (
                    <InfiniteScroll
                        dataLength={sentReputations.length}
                        next={fetchMoreSentReputations}
                        hasMore={hasMore}
                        loader={
                            <LoadingContainer>
                                <Loader />
                            </LoadingContainer>
                        }
                    >
                        <SectionCard>
                            <SentReputationList>
                                {sentReputations.map(
                                    (sentReputation) => (
                                        <SentReputationCard
                                            key={
                                                sentReputation.id
                                            }
                                            targetName={
                                                sentReputation.targetName
                                            }
                                            workplaceName={
                                                sentReputation.workplaceName
                                            }
                                            timeAgo={
                                                sentReputation.timeAgo
                                            }
                                            status={
                                                sentReputation.status
                                            }
                                            statusDescription={
                                                sentReputation.statusDescription
                                            }
                                            onCancel={() =>
                                                handleCancel(
                                                    sentReputation
                                                )
                                            }
                                        />
                                    )
                                )}
                            </SentReputationList>
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
                                    d='M22 2L11 13'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <path
                                    d='M22 2L15 22L11 13L2 9L22 2Z'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </EmptyIcon>
                        <EmptyTitle>
                            보낸 평판이 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            아직 보낸 평판 요청이 없습니다.
                            <br />
                            다른 사용자에게 평판을
                            요청해보세요.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default SentReputationListPage;

const PageContainer = styled.div`
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    overscroll-behavior-y: contain;
    background: #f8f9fa;

    @media (max-width: 480px) {
        top: 56px;
    }

    @media (max-width: 360px) {
        top: 52px;
    }
`;

const ContentContainer = styled.div`
    padding: 20px 12px 12px 12px;
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const SentReputationList = styled.div`
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
