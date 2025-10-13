import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import ApplicationCard from '../../components/user/myJob/ApplicationCard';
import StatusFilter from '../../components/user/myJob/StatusFilter';
import { getApplicationList } from '../../services/myPage';
import { cancelApplication } from '../../services/myJob';
import { timeAgo } from '../../utils/timeUtil';
import Loader from '../../components/Loader';

const ApplicationListPage = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] =
        useState(false);
    const [selectedStatuses, setSelectedStatuses] =
        useState([]);
    const navigate = useNavigate();

    // 데이터 변환 함수
    const transformApplicationData = (data) => {
        return (data || []).map((item) => ({
            id: item.id,
            workplaceName:
                item.posting?.workspace?.name ||
                '알 수 없는 업장',
            status: item.status,
            position:
                item.postingSchedule?.position ||
                '알 수 없는 직책',
            wage: item.posting?.payAmount || '0',
            applicationDate: item.createdAt
                ? timeAgo(item.createdAt)
                : '알 수 없음',
        }));
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialApplications = async () => {
            try {
                setIsLoading(true);

                const applicationData =
                    await getApplicationList({
                        pageSize: 20,
                        status:
                            selectedStatuses.length > 0
                                ? selectedStatuses
                                : null,
                    });
                const formattedApplications =
                    transformApplicationData(
                        applicationData.data
                    );

                setApplications(formattedApplications);
                setNextCursor(
                    applicationData.page?.cursor || null
                );
                setHasMore(
                    formattedApplications.length === 20
                );
            } catch (error) {
                console.error(
                    '지원 목록 조회 실패:',
                    error
                );
                setApplications([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialApplications();
    }, [selectedStatuses]);

    // 더 많은 데이터 로드
    const fetchMoreApplications = useCallback(async () => {
        if (!hasMore || isLoadingMore || !nextCursor)
            return;

        try {
            setIsLoadingMore(true);

            const applicationData =
                await getApplicationList({
                    pageSize: 20,
                    cursor: nextCursor,
                    status:
                        selectedStatuses.length > 0
                            ? selectedStatuses
                            : null,
                });
            const newApplications =
                transformApplicationData(
                    applicationData.data
                );

            setApplications((prev) => [
                ...prev,
                ...newApplications,
            ]);
            setNextCursor(
                applicationData.page?.cursor || null
            );
            setHasMore(newApplications.length === 20);
        } catch (error) {
            console.error(
                '추가 지원 목록 조회 실패:',
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

    // 지원 클릭 핸들러
    const handleApplicationClick = (application) => {
        console.log('지원 클릭:', application);
        // 지원 상세 페이지로 이동하는 로직 (필요시 구현)
    };

    // 지원 취소 핸들러
    const handleApplicationCancel = async (application) => {
        try {
            console.log('지원 취소:', application);
            await cancelApplication(application.id);

            // 최신 지원 목록 다시 가져오기
            const applicationData =
                await getApplicationList({
                    pageSize: 20,
                    cursor: null,
                    status:
                        selectedStatuses.length > 0
                            ? selectedStatuses.join(',')
                            : null,
                });
            const formattedApplications =
                transformApplicationData(
                    applicationData.data
                );

            setApplications(formattedApplications);
            setNextCursor(
                applicationData.page?.cursor || null
            );
            setHasMore(formattedApplications.length === 20);

            console.log('지원 취소 성공');
        } catch (error) {
            console.error('지원 취소 오류:', error);
            alert('지원 취소 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='지원 현황' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='지원 현황' />
            <ContentContainer>
                <StatusFilter
                    selectedStatuses={selectedStatuses}
                    onStatusChange={setSelectedStatuses}
                />
                {applications.length > 0 ? (
                    <InfiniteScroll
                        dataLength={applications.length}
                        next={fetchMoreApplications}
                        hasMore={hasMore}
                        loader={
                            <LoadingContainer>
                                <Loader />
                            </LoadingContainer>
                        }
                    >
                        <SectionCard>
                            <ApplicationList>
                                {applications.map(
                                    (application) => (
                                        <ApplicationCard
                                            key={
                                                application.id
                                            }
                                            workplaceName={
                                                application.workplaceName
                                            }
                                            status={
                                                application.status
                                            }
                                            position={
                                                application.position
                                            }
                                            wage={
                                                application.wage
                                            }
                                            applicationDate={
                                                application.applicationDate
                                            }
                                            onClick={() =>
                                                handleApplicationClick(
                                                    application
                                                )
                                            }
                                            onCancel={() =>
                                                handleApplicationCancel(
                                                    application
                                                )
                                            }
                                        />
                                    )
                                )}
                            </ApplicationList>
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
                        <EmptyTitle>
                            지원한 공고가 없습니다
                        </EmptyTitle>
                        <EmptyDescription>
                            아직 지원한 공고가 없습니다.
                            <br />
                            관심 있는 공고에 지원해보세요.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default ApplicationListPage;

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

const ApplicationList = styled.div`
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
