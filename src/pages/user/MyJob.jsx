import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import BottomNavigation from '../../layouts/BottomNavigation';
import WorkplaceSection from '../../components/user/myJob/WorkplaceSection';
import ReputationSection from '../../components/user/myJob/ReputationSection';
import SentReputationSection from '../../components/user/myJob/SentReputationSection';
import SentSubstituteRequestSection from '../../components/user/myJob/SentSubstituteRequestSection';
import ApplicationSection from '../../components/user/myJob/ApplicationSection';
import ScheduleSection from '../../components/user/myJob/ScheduleSection';
import {
    getUserReputationRequestsList,
    getUserSentReputationRequestsList,
    getUserWorkplaceList,
    getUserScheduleSelf,
    userDeclineReputation,
    cancelSentReputationRequest,
    cancelApplication,
} from '../../services/myJob';
import { getApplicationList } from '../../services/myPage';
import { getSentSubstituteRequests } from '../../services/scheduleRequest';
import { timeAgo } from '../../utils/timeUtil';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const MyJob = () => {
    const [workplaces, setWorkplaces] = useState([]);
    const [reputations, setReputations] = useState([]);
    const [sentReputations, setSentReputations] = useState(
        []
    );
    const [
        sentSubstituteRequests,
        setSentSubstituteRequests,
    ] = useState([]);
    const [applications, setApplications] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 데이터 로딩
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // 평판 요청 목록 조회
            try {
                const reputationData =
                    await getUserReputationRequestsList(3);

                // API 데이터를 컴포넌트에 맞게 변환
                const formattedReputations = (
                    reputationData.data || []
                ).map((item) => {
                    // 요청자 타입에 따른 로직 처리
                    let workplaceName = '알 수 없는 업장';
                    let reviewerName = '알 수 없는 요청자';

                    if (item.requester?.type === 'USER') {
                        // 요청자가 USER인 경우: 요청자 이름 + 근무한 업장 이름
                        workplaceName =
                            item.workspace?.businessName ||
                            item.target?.name ||
                            '알 수 없는 업장';
                        reviewerName =
                            item.requester?.name ||
                            item.requesterName ||
                            '알 수 없는 요청자';
                    } else if (
                        item.requester?.type === 'WORKSPACE'
                    ) {
                        // 요청자가 WORKSPACE인 경우: 요청자 이름이 workspace 이름
                        workplaceName =
                            item.requester?.name ||
                            item.requesterName ||
                            '알 수 없는 업장';
                        reviewerName =
                            item.requester?.name ||
                            item.requesterName ||
                            '알 수 없는 요청자';
                    } else {
                        // 기존 로직 (타입 정보가 없는 경우)
                        workplaceName =
                            item.workplaceName ||
                            item.target?.name ||
                            '알 수 없는 업장';
                        reviewerName =
                            item.requesterName ||
                            item.requester?.name ||
                            '알 수 없는 요청자';
                    }

                    return {
                        id: item.id,
                        workplaceName,
                        reviewerName,
                        timeAgo: item.createdAt
                            ? timeAgo(item.createdAt)
                            : '알 수 없음',
                        rating: item.rating || 0,
                        isNew: item.isNew || false,
                        requesterType:
                            item.requester?.type ||
                            'UNKNOWN',
                    };
                });

                setReputations(formattedReputations);
            } catch (error) {
                console.error(
                    '평판 요청 조회 오류:',
                    error
                );
                setReputations([]);
            }

            // 보낸 평판 요청 목록 조회 (요청 중인 것만)
            try {
                const sentReputationData =
                    await getUserSentReputationRequestsList(
                        3,
                        null,
                        'REQUESTED'
                    );

                // API 데이터를 컴포넌트에 맞게 변환
                const formattedSentReputations = (
                    sentReputationData.data || []
                ).map((item) => {
                    let targetName = '알 수 없는 대상';
                    let workplaceName = '알 수 없는 업장';

                    if (item.target?.type === 'USER') {
                        targetName =
                            item.target?.name ||
                            '알 수 없는 대상';
                        workplaceName =
                            item.workspace?.businessName ||
                            '알 수 없는 업장';
                    } else if (
                        item.target?.type === 'WORKSPACE'
                    ) {
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
                        status:
                            item.status?.value ||
                            'REQUESTED',
                        statusDescription:
                            item.status?.description ||
                            '요청됨',
                    };
                });

                setSentReputations(
                    formattedSentReputations
                );
            } catch (error) {
                console.error(
                    '보낸 평판 조회 오류:',
                    error
                );
                setSentReputations([]);
            }

            // 보낸 대타 요청 목록 조회 (PENDING 상태만)
            try {
                const sentSubstituteRequestData =
                    await getSentSubstituteRequests(
                        3,
                        null,
                        'PENDING'
                    );

                // API 데이터를 컴포넌트에 맞게 변환
                const formattedSentSubstituteRequests = (
                    sentSubstituteRequestData.data?.data ||
                    []
                ).map((item) => {
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
                        scheduleDate:
                            startDate.toLocaleDateString(
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
                        )} ~ ${endDate.toLocaleTimeString(
                            'ko-KR',
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            }
                        )}`,
                        position:
                            item.schedule.position ||
                            '알 수 없는 직책',
                        timeAgo: item.createdAt
                            ? timeAgo(item.createdAt)
                            : '알 수 없음',
                        status:
                            item.status?.value || 'PENDING',
                        statusDescription:
                            item.status?.description ||
                            '대기 중',
                    };
                });

                setSentSubstituteRequests(
                    formattedSentSubstituteRequests
                );
            } catch (error) {
                console.error(
                    '보낸 대타 요청 조회 오류:',
                    error
                );
                setSentSubstituteRequests([]);
            }

            // 지원 현황 데이터 조회 (지원완료 상태만)
            try {
                const applicationData =
                    await getApplicationList({
                        pageSize: 3,
                        status: ['SUBMITTED'], // 지원완료 상태만 조회
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
            } catch (error) {
                console.error(
                    '지원 현황 조회 오류:',
                    error
                );
                setApplications([]);
            }

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
                            item.workspace?.workspaceName ||
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
                console.error('스케줄 조회 오류:', error);
                setSchedules([]);
            }

            setIsLoading(false);
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
        navigate('/reputation-list');
    };

    const handleSentReputationViewAll = () => {
        console.log('전체 보낸 평판 보기');
        navigate('/sent-reputation-list');
    };

    const handleSentSubstituteRequestViewAll = () => {
        console.log('전체 보낸 대타 요청 보기');
        navigate('/sent-substitute-request-list');
    };

    const handleSentSubstituteRequestCancel = async (
        request
    ) => {
        console.log('대타 요청 취소:', request);
        // TODO: 대타 요청 취소 API 호출
    };

    const handleSentReputationCancel = async (
        reputation
    ) => {
        try {
            console.log('보낸 평판 취소:', reputation);
            await cancelSentReputationRequest(
                reputation.id
            );

            // 최신 데이터 다시 가져오기 (요청 중인 것만)
            const sentReputationData =
                await getUserSentReputationRequestsList(
                    3,
                    null,
                    'REQUESTED'
                );
            const formattedSentReputations = (
                sentReputationData.data || []
            ).map((item) => {
                let targetName = '알 수 없는 대상';
                let workplaceName = '알 수 없는 업장';

                if (item.target?.type === 'USER') {
                    targetName =
                        item.target?.name ||
                        '알 수 없는 대상';
                    workplaceName =
                        item.workspace?.businessName ||
                        '알 수 없는 업장';
                } else if (
                    item.target?.type === 'WORKSPACE'
                ) {
                    targetName = '업장';
                    workplaceName =
                        item.target?.name ||
                        '알 수 없는 업장';
                }

                return {
                    id: item.id,
                    targetName,
                    workplaceName,
                    timeAgo: item.createdAt
                        ? timeAgo(item.createdAt)
                        : '알 수 없음',
                    status:
                        item.status?.value || 'REQUESTED',
                    statusDescription:
                        item.status?.description ||
                        '요청됨',
                };
            });

            setSentReputations(formattedSentReputations);
        } catch (error) {
            console.error('보낸 평판 취소 오류:', error);
            alert('평판 취소 중 오류가 발생했습니다.');
        }
    };

    // 지원 취소 핸들러
    const handleApplicationCancel = async (application) => {
        try {
            console.log('지원 취소:', application);
            await cancelApplication(application.id);

            // 최신 지원 목록 다시 가져오기 (지원완료 상태만)
            const applicationData =
                await getApplicationList({
                    pageSize: 3,
                    status: ['SUBMITTED'], // 지원완료 상태만 조회
                });
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
            console.log('지원 취소 성공');
        } catch (error) {
            console.error('지원 취소 오류:', error);
            alert('지원 취소 중 오류가 발생했습니다.');
        }
    };

    const handleApplicationViewAll = () => {
        console.log('전체 지원 보기');
        navigate('/application-list');
    };

    const handleScheduleViewAll = () => {
        console.log('전체 일정 보기');
        navigate('/schedule-list');
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
                        <Loader />
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
                <SentReputationSection
                    sentReputations={sentReputations}
                    onViewAllClick={
                        handleSentReputationViewAll
                    }
                    onCancel={handleSentReputationCancel}
                />
                <SentSubstituteRequestSection
                    sentSubstituteRequests={
                        sentSubstituteRequests
                    }
                    onViewAllClick={
                        handleSentSubstituteRequestViewAll
                    }
                    onCancel={
                        handleSentSubstituteRequestCancel
                    }
                />
                <ApplicationSection
                    applications={applications}
                    onApplicationClick={
                        handleApplicationClick
                    }
                    onViewAllClick={
                        handleApplicationViewAll
                    }
                    onCancel={handleApplicationCancel}
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
    padding: 80px 16px 100px 16px;
    background: #f8f9fa;

    @media (max-width: 480px) {
        padding: 76px 12px 80px 12px;
    }

    @media (max-width: 360px) {
        padding: 72px 8px 70px 8px;
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
