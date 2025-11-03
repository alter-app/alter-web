import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import NotificationItem from '../../components/user/notification/NotificationItem';
import { getManagerNotifications } from '../../services/notification';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';
import OwnerBottomNavigation from '../../layouts/OwnerBottomNavigation';

const ManagerNotificationListPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // 알림 목록 조회
    const fetchNotifications = useCallback(
        async (
            currentCursor = null,
            isLoadMore = false
        ) => {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            try {
                const response =
                    await getManagerNotifications(
                        10, // pageSize
                        currentCursor
                    );

                const newNotifications =
                    response.data || [];

                if (isLoadMore) {
                    setNotifications((prev) => [
                        ...prev,
                        ...newNotifications,
                    ]);
                } else {
                    setNotifications(newNotifications);
                }

                setCursor(response.page?.cursor || null);
                setHasMore(!!response.page?.cursor);
                setTotalCount(
                    response.page?.totalCount || 0
                );
            } catch (error) {
                console.error(
                    '알림 목록 조회 실패:',
                    error
                );
                if (!isLoadMore) {
                    setNotifications([]);
                }
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        []
    );

    // 초기 데이터 로드
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // 더 많은 데이터 로드
    const loadMoreData = useCallback(() => {
        if (cursor && !isLoadingMore) {
            fetchNotifications(cursor, true);
        }
    }, [cursor, isLoadingMore, fetchNotifications]);

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='알림' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
                <OwnerBottomNavigation />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='알림' />
            <ContentContainer>
                <InfoWrapper>
                    <TotalCountText>
                        총{' '}
                        <TotalCount>
                            {totalCount}
                        </TotalCount>
                        건
                    </TotalCountText>
                </InfoWrapper>

                {notifications.length > 0 ? (
                    <InfiniteScroll
                        dataLength={notifications.length}
                        next={loadMoreData}
                        hasMore={hasMore}
                        loader={
                            isLoadingMore ? (
                                <LoadingContainer>
                                    <Loader />
                                </LoadingContainer>
                            ) : null
                        }
                    >
                        <SectionCard>
                            <NotificationList>
                                {notifications.map(
                                    (notification) => (
                                        <NotificationItem
                                            key={
                                                notification.id
                                            }
                                            id={
                                                notification.id
                                            }
                                            title={
                                                notification.title
                                            }
                                            body={
                                                notification.body
                                            }
                                            createdAt={
                                                notification.createdAt
                                            }
                                            timeAgo={timeAgo(
                                                notification.createdAt
                                            )}
                                        />
                                    )
                                )}
                            </NotificationList>
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
                            알림이 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            새로운 알림이 도착하면 여기에
                            표시됩니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
            <OwnerBottomNavigation />
        </PageContainer>
    );
};

export default ManagerNotificationListPage;

const PageContainer = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
    padding-top: 60px;
    padding-bottom: 80px;
`;

const ContentContainer = styled.div`
    padding: 12px;
    padding-top: 20px;
`;

const InfoWrapper = styled.div`
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

const NotificationList = styled.div`
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
