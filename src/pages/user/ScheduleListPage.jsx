import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import PageHeader from '../../components/shared/PageHeader';
import ScheduleItem from '../../components/user/myJob/ScheduleItem';
import { getUserScheduleSelf } from '../../services/myJob';
import Loader from '../../components/Loader';

const ScheduleListPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const navigate = useNavigate();

    // 데이터 변환 함수
    const transformScheduleData = (data) => {
        return (data || []).map((item) => {
            const startDate = new Date(item.startDateTime);
            const endDate = new Date(item.endDateTime);

            // 근무 시간 계산 (시간 단위)
            const workHours = Math.round(
                (endDate - startDate) / (1000 * 60 * 60)
            );

            return {
                id: item.shiftId,
                day: startDate.toLocaleDateString('ko-KR', {
                    weekday: 'short',
                }),
                date: startDate.getDate().toString(),
                workplace: item.workspace?.workspaceName || '알 수 없는 업장',
                time: `${startDate.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                })} ~ ${endDate.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`,
                hours: `${workHours}시간`,
            };
        });
    };

    // 초기 데이터 로드 (현재 월)
    useEffect(() => {
        const fetchInitialSchedules = async () => {
            try {
                setIsLoading(true);

                // 현재 월 스케줄 조회
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                const scheduleData = await getUserScheduleSelf(
                    currentYear,
                    currentMonth
                );
                const formattedSchedules = transformScheduleData(
                    scheduleData.data
                );

                setSchedules(formattedSchedules);
                setCurrentYear(currentYear);
                setCurrentMonth(currentMonth);
                setHasMore(false);
            } catch (error) {
                console.error('스케줄 목록 조회 실패:', error);
                setSchedules([]);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialSchedules();
    }, []);

    // 월별 스케줄 로드
    const fetchMonthlySchedules = useCallback(async (year, month) => {
        try {
            setIsLoading(true);

            const scheduleData = await getUserScheduleSelf(year, month);
            const formattedSchedules = transformScheduleData(scheduleData.data);

            setSchedules(formattedSchedules);
            setCurrentYear(year);
            setCurrentMonth(month);
        } catch (error) {
            console.error('월별 스케줄 조회 실패:', error);
            setSchedules([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 이전 달
    const handlePreviousMonth = () => {
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        fetchMonthlySchedules(prevYear, prevMonth);
    };

    // 다음 달
    const handleNextMonth = () => {
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        fetchMonthlySchedules(nextYear, nextMonth);
    };

    // 스케줄 클릭 핸들러
    const handleScheduleClick = (schedule) => {
        console.log('스케줄 클릭:', schedule);
        // 스케줄 상세 페이지로 이동하는 로직 (필요시 구현)
    };

    if (isLoading) {
        return (
            <PageContainer>
                <PageHeader title='내 일정' />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title='내 일정' />
            <ContentContainer>
                {/* 월별 네비게이션 */}
                <MonthNavigation>
                    <MonthButton onClick={handlePreviousMonth}>
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M15 18L9 12L15 6'
                                stroke='#666666'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </MonthButton>
                    <MonthTitle>
                        {currentYear}년 {currentMonth}월
                    </MonthTitle>
                    <MonthButton onClick={handleNextMonth}>
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M9 18L15 12L9 6'
                                stroke='#666666'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </MonthButton>
                </MonthNavigation>

                {schedules.length > 0 ? (
                    <SectionCard>
                        <ScheduleList>
                            {schedules.map((schedule) => (
                                <ScheduleItem
                                    key={schedule.id}
                                    day={schedule.day}
                                    date={schedule.date}
                                    workplace={schedule.workplace}
                                    time={schedule.time}
                                    hours={schedule.hours}
                                    onClick={() =>
                                        handleScheduleClick(schedule)
                                    }
                                />
                            ))}
                        </ScheduleList>
                    </SectionCard>
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
                                    d='M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
                                    stroke='#cccccc'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </EmptyIcon>
                        <EmptyTitle>일정이 없습니다</EmptyTitle>
                        <EmptyDescription>
                            {currentYear}년 {currentMonth}
                            월에는
                            <br />
                            등록된 일정이 없습니다.
                        </EmptyDescription>
                    </EmptyContainer>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default ScheduleListPage;

const PageContainer = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
`;

const ContentContainer = styled.div`
    padding: 12px;
    padding-top: 20px;
`;

const MonthNavigation = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
`;

const MonthButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #f8f9fa;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #e9ecef;
    }

    &:active {
        transform: scale(0.95);
    }
`;

const MonthTitle = styled.h2`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const ThisWeekButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: #2de283;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 20px;

    &:hover {
        background: #26c973;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const ScheduleList = styled.div`
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
