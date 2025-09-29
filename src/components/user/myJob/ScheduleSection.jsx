import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import ScheduleItem from './ScheduleItem';
import ViewAllButton from './ViewAllButton';

const ScheduleSection = ({ schedules, onViewAllClick }) => {
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

    return (
        <Section>
            <SectionCard>
                <SectionHeader
                    icon={calendarIcon}
                    title='이번 주 일정'
                />
                <ScheduleList>
                    {schedules.length > 0 ? (
                        schedules.map((schedule, index) => (
                            <ScheduleItem
                                key={index}
                                day={schedule.day}
                                date={schedule.date}
                                workplace={
                                    schedule.workplace
                                }
                                time={schedule.time}
                                hours={schedule.hours}
                            />
                        ))
                    ) : (
                        <EmptyMessage>
                            이번 주 일정이 없습니다
                        </EmptyMessage>
                    )}
                </ScheduleList>
                <ViewAllButton onClick={onViewAllClick}>
                    전체 일정 보기
                </ViewAllButton>
            </SectionCard>
        </Section>
    );
};

export default ScheduleSection;

const Section = styled.div`
    margin-bottom: 30px;
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const ScheduleList = styled.div`
    margin-top: 16px;
`;

const EmptyMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
    text-align: center;
`;
