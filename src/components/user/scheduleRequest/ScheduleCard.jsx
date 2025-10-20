import styled from 'styled-components';

const ScheduleCard = ({
    schedule,
    isSelected,
    onSelect,
}) => {
    return (
        <Card $isSelected={isSelected} onClick={onSelect}>
            <DateSection $isSelected={isSelected}>
                <DayOfWeek $isSelected={isSelected}>
                    {schedule.dayOfWeek}
                </DayOfWeek>
                <Date $isSelected={isSelected}>
                    {schedule.date}
                </Date>
            </DateSection>
            <ScheduleInfo>
                <WorkplaceName $isSelected={isSelected}>
                    {schedule.workplaceName}
                </WorkplaceName>
                <TimeRange $isSelected={isSelected}>
                    {schedule.startTime} ~{' '}
                    {schedule.endTime}
                </TimeRange>
                <Duration $isSelected={isSelected}>
                    {schedule.duration}
                </Duration>
            </ScheduleInfo>
        </Card>
    );
};

export default ScheduleCard;

const Card = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: ${(props) =>
        props.$isSelected ? '#25c973' : '#ffffff'};
    border: 2px solid
        ${(props) =>
            props.$isSelected ? '#25c973' : '#e9ecef'};
    border-radius: 12px;
    cursor: pointer;
`;

const DateSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 50px;
    padding: 8px;
    background: ${(props) =>
        props.$isSelected ? '#ffffff' : '#f8f9fa'};
    border-radius: 8px;
`;

const DayOfWeek = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: ${(props) =>
        props.$isSelected ? '#25c973' : '#666666'};
`;

const Date = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    color: ${(props) =>
        props.$isSelected ? '#25c973' : '#333333'};
`;

const ScheduleInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const WorkplaceName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 13px;
    color: ${(props) =>
        props.$isSelected ? '#ffffff' : '#333333'};
`;

const TimeRange = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: ${(props) =>
        props.$isSelected ? '#ffffff' : '#666666'};
`;

const Duration = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: ${(props) =>
        props.$isSelected ? '#ffffff' : '#666666'};
`;
