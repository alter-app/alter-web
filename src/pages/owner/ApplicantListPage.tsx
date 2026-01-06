import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import ApplicantCard from '../../components/owner/applicant/ApplicantCard';
import StatusFilter from '../../components/owner/applicant/StatusFilter';
import { getPostingsApplications } from '../../services/managerPage';
import { getWorkplaceList } from '../../services/mainPageService';
import Loader from '../../components/Loader';

const ApplicantListPage = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [cursorInfo, setCursorInfo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedWorkplace, setSelectedWorkplace] = useState('');
    const [workplaceList, setWorkplaceList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    // 업장 목록 조회
    useEffect(() => {
        const fetchWorkplaceList = async () => {
            try {
                const result = await getWorkplaceList();
                setWorkplaceList([
                    { id: '', businessName: '전체 업장' },
                    ...result.data,
                ]);
            } catch (error) {
                console.error('업장 목록 조회 오류:', error);
            }
        };
        fetchWorkplaceList();
    }, []);

    // 초기 데이터 로드
    useEffect(() => {
        const fetchInitialApplications = async () => {
            try {
                setIsLoading(true);

                const result = await getPostingsApplications({
                    cursorInfo: '',
                    checkedWorkplaceId: selectedWorkplace,
                    checkedStatusId: selectedStatus,
                });

                const applicationsData = result.data || [];
                const newCursorInfo = result.page?.cursor || '';

                setApplications(applicationsData);
                setCursorInfo(newCursorInfo);
                setTotalCount(result.page?.totalCount || 0);

                // 데이터가 10개 미만이거나 cursorInfo가 없으면 더 이상 데이터가 없음
                setHasMore(
                    applicationsData.length >= 10 && newCursorInfo !== ''
                );
            } catch (error) {
                console.error('지원 목록 조회 실패:', error);
                setApplications([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialApplications();
    }, [selectedStatus, selectedWorkplace]);

    // 더 많은 데이터 로드
    const fetchMoreApplications = useCallback(async () => {
        if (!hasMore || !cursorInfo) return;

        try {
            const result = await getPostingsApplications({
                cursorInfo,
                checkedWorkplaceId: selectedWorkplace,
                checkedStatusId: selectedStatus,
            });

            const newApplications = result.data || [];
            const newCursorInfo = result.page?.cursor || '';

            setApplications((prev) => [...prev, ...newApplications]);
            setCursorInfo(newCursorInfo);

            // 데이터가 10개 미만이거나 cursorInfo가 없으면 더 이상 데이터가 없음
            setHasMore(newApplications.length >= 10 && newCursorInfo !== '');
        } catch (error) {
            console.error('추가 지원 목록 조회 실패:', error);
            setHasMore(false);
        }
    }, [hasMore, cursorInfo, selectedStatus, selectedWorkplace]);

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='지원자 목록' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='지원자 목록' />
            <ContentContainer>
                <StatusFilter
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedWorkplace={selectedWorkplace}
                    onWorkplaceChange={setSelectedWorkplace}
                    workplaceList={workplaceList}
                    totalCount={totalCount}
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
                                {applications.map((application) => (
                                    <ApplicantCard
                                        key={application.id}
                                        application={application}
                                    />
                                ))}
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
                        <EmptyTitle>지원자가 없습니다</EmptyTitle>
                        <EmptyDescription>
                            아직 지원자가 없습니다.
                            <br />
                            공고를 등록하고 지원자를 기다려보세요.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default ApplicantListPage;

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
    background: transparent;
    border-radius: 16px;
    padding: 0;
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
