import styled from 'styled-components';
import ScheduleCard from './ScheduleCard';

const AvailableScheduleList = ({
    onScheduleSelect,
    selectedSchedule,
    currentYear,
    currentMonth,
    onPreviousMonth,
    onNextMonth,
}) => {
    // TODO: API에서 데이터 가져오기
    const availableSchedules = [
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
                {availableSchedules.map((schedule) => (
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
                ))}
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
