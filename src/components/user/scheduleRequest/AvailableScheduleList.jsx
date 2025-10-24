import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ScheduleCard from './ScheduleCard';
import { getExchangeableSchedules } from '../../../services/scheduleRequest';

const AvailableScheduleList = ({
    onScheduleSelect,
    selectedSchedule,
    currentYear,
    currentMonth,
    onPreviousMonth,
    onNextMonth,
    workplaceId,
}) => {
    const [availableSchedules, setAvailableSchedules] =
        useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 스케줄 데이터 변환 함수
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
                dayOfWeek: startDate.toLocaleDateString(
                    'ko-KR',
                    {
                        weekday: 'short',
                    }
                ),
                date: startDate.getDate().toString(),
                position:
                    item.position || '알 수 없는 직책',
                startTime: startDate.toLocaleTimeString(
                    'ko-KR',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }
                ),
                endTime: endDate.toLocaleTimeString(
                    'ko-KR',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }
                ),
                duration: `${workHours}시간`,
            };
        });
    };

    // 스케줄 데이터 가져오기
    useEffect(() => {
        const fetchSchedules = async () => {
            if (!workplaceId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const result =
                    await getExchangeableSchedules(
                        workplaceId,
                        currentYear,
                        currentMonth
                    );
                const formattedSchedules =
                    transformScheduleData(result.data);
                setAvailableSchedules(formattedSchedules);
            } catch (error) {
                console.error('스케줄 조회 실패:', error);
                setAvailableSchedules([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [workplaceId, currentYear, currentMonth]);

    // 더미 데이터 (테스트용)
    const dummySchedules = [
        {
            id: 1,
            dayOfWeek: '월',
            date: '13',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 10:00',
            endTime: '오후 06:00',
            duration: '8시간',
        },
        {
            id: 2,
            dayOfWeek: '화',
            date: '14',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오후 04:00',
            endTime: '오후 10:00',
            duration: '6시간',
        },
        {
            id: 3,
            dayOfWeek: '화',
            date: '14',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오후 04:00',
            endTime: '오후 09:00',
            duration: '5시간',
        },
        {
            id: 4,
            dayOfWeek: '수',
            date: '15',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 09:00',
            endTime: '오후 05:00',
            duration: '8시간',
        },
        {
            id: 5,
            dayOfWeek: '수',
            date: '15',
            workplaceName: '스타벅스 강남점',
            startTime: '오후 02:00',
            endTime: '오후 10:00',
            duration: '8시간',
        },
        {
            id: 6,
            dayOfWeek: '목',
            date: '16',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 10:00',
            endTime: '오후 06:00',
            duration: '8시간',
        },
        {
            id: 7,
            dayOfWeek: '목',
            date: '16',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오후 03:00',
            endTime: '오후 09:00',
            duration: '6시간',
        },
        {
            id: 8,
            dayOfWeek: '금',
            date: '17',
            workplaceName: '스타벅스 강남점',
            startTime: '오전 09:00',
            endTime: '오후 05:00',
            duration: '8시간',
        },
        {
            id: 9,
            dayOfWeek: '금',
            date: '17',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오후 02:00',
            endTime: '오후 10:00',
            duration: '8시간',
        },
        {
            id: 10,
            dayOfWeek: '토',
            date: '18',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 10:00',
            endTime: '오후 06:00',
            duration: '8시간',
        },
        {
            id: 11,
            dayOfWeek: '토',
            date: '18',
            workplaceName: '스타벅스 강남점',
            startTime: '오후 01:00',
            endTime: '오후 09:00',
            duration: '8시간',
        },
        {
            id: 12,
            dayOfWeek: '일',
            date: '19',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 11:00',
            endTime: '오후 07:00',
            duration: '8시간',
        },
        {
            id: 13,
            dayOfWeek: '월',
            date: '20',
            workplaceName: '스타벅스 강남점',
            startTime: '오전 09:00',
            endTime: '오후 05:00',
            duration: '8시간',
        },
        {
            id: 14,
            dayOfWeek: '월',
            date: '20',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오후 04:00',
            endTime: '오후 10:00',
            duration: '6시간',
        },
        {
            id: 15,
            dayOfWeek: '화',
            date: '21',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 10:00',
            endTime: '오후 06:00',
            duration: '8시간',
        },
        {
            id: 16,
            dayOfWeek: '화',
            date: '21',
            workplaceName: '스타벅스 강남점',
            startTime: '오후 03:00',
            endTime: '오후 09:00',
            duration: '6시간',
        },
        {
            id: 17,
            dayOfWeek: '수',
            date: '22',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 09:00',
            endTime: '오후 05:00',
            duration: '8시간',
        },
        {
            id: 18,
            dayOfWeek: '수',
            date: '22',
            workplaceName: '스타벅스 강남점',
            startTime: '오후 02:00',
            endTime: '오후 10:00',
            duration: '8시간',
        },
        {
            id: 19,
            dayOfWeek: '목',
            date: '23',
            workplaceName: '메가MGC커피 동양미래대학점',
            startTime: '오전 10:00',
            endTime: '오후 06:00',
            duration: '8시간',
        },
        {
            id: 20,
            dayOfWeek: '목',
            date: '23',
            workplaceName: '스타벅스 강남점',
            startTime: '오후 01:00',
            endTime: '오후 09:00',
            duration: '8시간',
        },
    ];

    return (
        <Section>
            <SectionHeader>
                <HeaderLeft>
                    <SectionTitle>
                        요청 가능한 스케줄
                    </SectionTitle>
                </HeaderLeft>
                <MonthNavigation>
                    <MonthButton onClick={onPreviousMonth}>
                        <svg
                            width='16'
                            height='16'
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
                    <MonthInfo>
                        {currentYear}.
                        {String(currentMonth).padStart(
                            2,
                            '0'
                        )}
                    </MonthInfo>
                    <MonthButton onClick={onNextMonth}>
                        <svg
                            width='16'
                            height='16'
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
            </SectionHeader>
            <ScheduleList>
                {isLoading ? (
                    <LoadingMessage>
                        스케줄을 불러오는 중...
                    </LoadingMessage>
                ) : availableSchedules.length > 0 ? (
                    availableSchedules.map((schedule) => (
                        <ScheduleCard
                            key={schedule.id}
                            schedule={schedule}
                            isSelected={
                                selectedSchedule?.id ===
                                schedule.id
                            }
                            onSelect={() =>
                                onScheduleSelect(schedule)
                            }
                        />
                    ))
                ) : (
                    <EmptyMessage>
                        {currentYear}년 {currentMonth}월에는
                        <br />
                        요청 가능한 스케줄이 없습니다.
                    </EmptyMessage>
                )}
            </ScheduleList>
        </Section>
    );
};

export default AvailableScheduleList;

const Section = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SectionIcon = styled.span`
    font-size: 20px;
`;

const SectionTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const MonthInfo = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    min-width: 70px;
    text-align: center;
`;

const MonthNavigation = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const MonthButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
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

const ScheduleList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 4px;

    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;

        &:hover {
            background: #a1a1a1;
        }
    }
`;

const LoadingMessage = styled.div`
    padding: 40px 20px;
    text-align: center;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const EmptyMessage = styled.div`
    padding: 40px 20px;
    text-align: center;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 1.5;
`;
