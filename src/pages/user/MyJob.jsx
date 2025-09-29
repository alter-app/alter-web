import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import BottomNavigation from '../../layouts/BottomNavigation';
import WorkplaceSection from '../../components/user/myJob/WorkplaceSection';
import ReputationSection from '../../components/user/myJob/ReputationSection';
import ApplicationSection from '../../components/user/myJob/ApplicationSection';
import ScheduleSection from '../../components/user/myJob/ScheduleSection';
import {
    getUserReputationRequestsList,
    getUserWorkplaceList,
    getUserScheduleSelf,
    userSubmitReputation,
    userDeclineReputation,
} from '../../services/myJob';
import { getApplicationList } from '../../services/myPage';
import { timeAgo } from '../../utils/timeUtil';
import { useNavigate } from 'react-router-dom';

const MyJob = () => {
    const [workplaces, setWorkplaces] = useState([]);
    const [reputations, setReputations] = useState([]);
    const [applications, setApplications] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 데이터 로딩
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // 평판 요청 목록 조회
                const reputationData =
                    await getUserReputationRequestsList(3);

                // API 데이터를 컴포넌트에 맞게 변환
                const formattedReputations = (
                    reputationData.data || []
                ).map((item) => ({
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

                setReputations(formattedReputations);

                // 지원 현황 데이터 조회
                const applicationData =
                    await getApplicationList({
                        page: 1,
                        pageSize: 3,
                    });

                // API 데이터를 컴포넌트에 맞게 변환
                const formattedApplications = (
                    applicationData.data || []
                ).map((item) => ({
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

                setApplications(formattedApplications);

                // 근무 중인 업장 데이터 조회
                try {
                    const workplaceData =
                        await getUserWorkplaceList(3);

                    // API 데이터를 컴포넌트에 맞게 변환
                    const formattedWorkplaces = (
                        workplaceData.data?.data || []
                    ).map((item) => {
                        let nextShiftText = '정보 없음';

                        if (item.nextShiftDateTime) {
                            const nextShiftDate = new Date(
                                item.nextShiftDateTime
                            );
                            nextShiftText = `${nextShiftDate.getFullYear()}-${(
                                nextShiftDate.getMonth() + 1
                            )
                                .toString()
                                .padStart(
                                    2,
                                    '0'
                                )}-${nextShiftDate
                                .getDate()
                                .toString()
                                .padStart(
                                    2,
                                    '0'
                                )} ${nextShiftDate
                                .getHours()
                                .toString()
                                .padStart(
                                    2,
                                    '0'
                                )}:${nextShiftDate
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}`;
                        }

                        return {
                            id: item.workspaceId,
                            name:
                                item.businessName ||
                                '알 수 없는 업장',
                            status: 'working',
                            position: '근무자',
                            wage: '0',
                            nextShift: nextShiftText,
                        };
                    });

                    setWorkplaces(formattedWorkplaces);
                } catch (error) {
                    console.error(
                        '근무 중인 업장 조회 오류:',
                        error
                    );
                    // 에러 발생 시 빈 배열로 초기화
                    setWorkplaces([]);
                }

                // 이번 주 일정 데이터 조회 (최근 데이터)
                try {
                    const scheduleData =
                        await getUserScheduleSelf();

                    // API 데이터를 컴포넌트에 맞게 변환
                    const formattedSchedules = (
                        scheduleData.data || []
                    ).map((item) => {
                        const startDate = new Date(
                            item.startDateTime
                        );
                        const endDate = new Date(
                            item.endDateTime
                        );

                        // 근무 시간 계산 (시간 단위)
                        const workHours = Math.round(
                            (endDate - startDate) /
                                (1000 * 60 * 60)
                        );

                        return {
                            id: item.shiftId,
                            day: startDate.toLocaleDateString(
                                'ko-KR',
                                {
                                    weekday: 'short',
                                }
                            ),
                            date: startDate
                                .getDate()
                                .toString(),
                            workplace:
                                item.workspace
                                    ?.workspaceName ||
                                '알 수 없는 업장',
                            time: `${startDate.toLocaleTimeString(
                                'ko-KR',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )} ~ ${endDate.toLocaleTimeString(
                                'ko-KR',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}`,
                            hours: `${workHours}시간`,
                        };
                    });

                    setSchedules(formattedSchedules);
                } catch (error) {
                    console.error(
                        '스케줄 조회 오류:',
                        error
                    );
                    // 에러 발생 시 빈 배열로 초기화
                    setSchedules([]);
                }
            } catch (error) {
                console.error('데이터 로딩 오류:', error);
                // 에러 발생 시 빈 배열로 초기화
                setReputations([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleWorkplaceClick = (workplace) => {
        console.log('근무지 클릭:', workplace);
        navigate(
            `/my-job/workplace/${
                workplace.id
            }/${encodeURIComponent(workplace.name)}`
        );
    };

    const handleApplicationClick = (application) => {
        console.log('지원 현황 클릭:', application);
        // 지원 상세 페이지로 이동하는 로직
    };

    const handleWorkplaceViewAll = () => {
        console.log('전체 업장 보기');
        // 전체 업장 페이지로 이동하는 로직
    };

    const handleReputationViewAll = () => {
        console.log('전체 평판 보기');
        // 전체 평판 페이지로 이동하는 로직
    };

    const handleApplicationViewAll = () => {
        console.log('전체 지원 보기');
        // 전체 지원 페이지로 이동하는 로직
    };

    const handleScheduleViewAll = () => {
        console.log('전체 일정 보기');
        // 전체 일정 페이지로 이동하는 로직
    };

    const handleReputationAccept = async (reputation) => {
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

    const handleReputationReject = async (reputation) => {
        try {
            console.log('평판 거절:', reputation);
            await userDeclineReputation(reputation.id);

            alert('평판이 거절되었습니다.');

            // 목록에서 제거
            setReputations((prev) =>
                prev.filter(
                    (item) => item.id !== reputation.id
                )
            );
        } catch (error) {
            console.error('평판 거절 오류:', error);
            alert('평판 거절 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title='내 알바'
                    showBackButton={false}
                />
                <Container>
                    <LoadingMessage>
                        데이터를 불러오는 중...
                    </LoadingMessage>
                </Container>
                <BottomNavigation />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title='내 알바'
                showBackButton={false}
            />
            <Container>
                <WorkplaceSection
                    workplaces={workplaces}
                    onWorkplaceClick={handleWorkplaceClick}
                    onViewAllClick={handleWorkplaceViewAll}
                />
                <ReputationSection
                    reputations={reputations}
                    onViewAllClick={handleReputationViewAll}
                    onAccept={handleReputationAccept}
                    onReject={handleReputationReject}
                />
                <ApplicationSection
                    applications={applications}
                    onApplicationClick={
                        handleApplicationClick
                    }
                    onViewAllClick={
                        handleApplicationViewAll
                    }
                />
                <ScheduleSection
                    schedules={schedules}
                    onViewAllClick={handleScheduleViewAll}
                />
            </Container>
            <BottomNavigation />
        </>
    );
};

export default MyJob;

const Container = styled.div`
    min-height: calc(100vh - 80px);
    padding: 20px 16px 100px 16px;
    background: #f8f9fa;

    @media (max-width: 480px) {
        padding: 30px 12px 80px 12px;
    }

    @media (max-width: 360px) {
        padding: 12px 8px 70px 8px;
    }
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #666666;
`;
