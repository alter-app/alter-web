import styled from 'styled-components';
import { useState } from 'react';
import ScheduleModal from './ScheduleModal';

const ScheduleCalendarSection = ({
    scheduleData,
    currentYear,
    currentMonth,
    onPrevMonth,
    onNextMonth,
}) => {
    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = useState(
        currentDate.getDate()
    ); // 현재 날짜로 초기화
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDayData, setSelectedDayData] =
        useState(null);

    const calendarIcon = (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
        >
            <rect
                x='3'
                y='4'
                width='18'
                height='18'
                rx='2'
                ry='2'
                stroke='#666666'
                strokeWidth='2'
            />
            <line
                x1='16'
                y1='2'
                x2='16'
                y2='6'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
            />
            <line
                x1='8'
                y1='2'
                x2='8'
                y2='6'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
            />
            <line
                x1='3'
                y1='10'
                x2='21'
                y2='10'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
            />
        </svg>
    );

    const weekDays = [
        '일',
        '월',
        '화',
        '수',
        '목',
        '금',
        '토',
    ];

    const handleDateClick = (date, dayData) => {
        setSelectedDate(date);
        setSelectedDayData(dayData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDayData(null);
    };

    // 오늘 날짜 확인 함수
    const isToday = (date) => {
        const today = new Date();
        return (
            date === today.getDate() &&
            currentMonth === today.getMonth() + 1 &&
            currentYear === today.getFullYear()
        );
    };

    return (
        <Section>
            <SectionHeader>
                <HeaderLeft>
                    <IconWrapper>
                        {calendarIcon}
                    </IconWrapper>
                    <Title>
                        {currentYear} {currentMonth}월
                        스케줄
                    </Title>
                </HeaderLeft>
                <HeaderRight>
                    <MonthNavigation>
                        <MonthButton onClick={onPrevMonth}>
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
                </HeaderRight>
            </SectionHeader>

            <CalendarContainer>
                <WeekHeader>
                    {weekDays.map((day, index) => (
                        <WeekDay
                            key={index}
                            $isSunday={index === 0}
                            $isSaturday={index === 6}
                        >
                            {day}
                        </WeekDay>
                    ))}
                </WeekHeader>

                <CalendarGrid>
                    {scheduleData.map((dayData, index) => (
                        <CalendarDay
                            key={
                                dayData.date ||
                                `empty-${index}`
                            }
                            $isToday={
                                dayData.date &&
                                isToday(dayData.date)
                            }
                            $isSunday={dayData.day === '일'}
                            $isSaturday={
                                dayData.day === '토'
                            }
                            $isOtherMonth={
                                dayData.isOtherMonth
                            }
                            onClick={() =>
                                dayData.date &&
                                handleDateClick(
                                    dayData.date,
                                    dayData
                                )
                            }
                        >
                            {dayData.date && (
                                <DateNumber
                                    $isToday={isToday(
                                        dayData.date
                                    )}
                                    $isSunday={
                                        dayData.day === '일'
                                    }
                                    $isSaturday={
                                        dayData.day === '토'
                                    }
                                >
                                    {dayData.date}
                                </DateNumber>
                            )}
                            {dayData.employees.length >
                                0 && (
                                <EmployeeNames>
                                    {dayData.employees.map(
                                        (
                                            name,
                                            empIndex
                                        ) => (
                                            <EmployeeName
                                                key={
                                                    empIndex
                                                }
                                            >
                                                {name}
                                            </EmployeeName>
                                        )
                                    )}
                                </EmployeeNames>
                            )}
                        </CalendarDay>
                    ))}
                </CalendarGrid>
            </CalendarContainer>

            <ScheduleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedDate={selectedDate}
                selectedDay={selectedDayData?.day}
                schedules={selectedDayData?.schedules || []}
            />
        </Section>
    );
};

export default ScheduleCalendarSection;

const Section = styled.div`
    margin-bottom: 30px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
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
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f5f5f5;
        border-color: #d0d0d0;
    }

    &:active {
        background: #e0e0e0;
    }
`;

const YearText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    min-width: 50px;
    text-align: center;
`;

const CalendarContainer = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
`;

const WeekHeader = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 12px;
`;

const WeekDay = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: ${(props) => {
        if (props.$isSunday) return '#e53e3e'; // 일요일 빨간색
        if (props.$isSaturday) return '#1976D2'; // 토요일 파란색
        return '#333333'; // 평일 검은색
    }};
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

const CalendarDay = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 60px;
    padding: 8px 4px;
    border-radius: 8px;
    cursor: ${(props) =>
        props.$isOtherMonth ? 'default' : 'pointer'};
    transition: all 0.2s ease;
    border: 2px solid transparent;
    background: ${(props) => {
        if (props.$isToday) return '#399982';
        if (props.$isOtherMonth) return '#f8f9fa';
        return 'transparent';
    }};
    border-color: transparent;
    opacity: ${(props) => (props.$isOtherMonth ? 0.3 : 1)};

    &:hover {
        background: ${(props) =>
            props.$isOtherMonth ? '#f8f9fa' : '#f5f5f5'};
    }
`;

const DateNumber = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: ${(props) => {
        if (props.$isToday) return '#ffffff'; // 오늘 날짜 흰색
        if (props.$isSunday) return '#e53e3e'; // 일요일 빨간색
        if (props.$isSaturday) return '#1976D2'; // 토요일 파란색
        return '#333333'; // 평일 검은색
    }};
    margin-bottom: 4px;
`;

const EmployeeNames = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
`;

const EmployeeName = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 10px;
    color: #666666;
    text-align: center;
    padding: 2px 4px;
    background: #f8f9fa;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
