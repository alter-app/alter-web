import styled from 'styled-components';

const ScheduleItem = ({ day, date, workplace, time, hours }) => {
    return (
        <ItemContainer>
            <DateInfo>
                <Day day={day}>{day}</Day>
                <Date>{date}일</Date>
            </DateInfo>
            <WorkInfo>
                <Workplace>{workplace}</Workplace>
                <Time>{time}</Time>
            </WorkInfo>
            <HoursBadge>{hours}</HoursBadge>
        </ItemContainer>
    );
};

export default ScheduleItem;

const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

const DateInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
    margin-right: 16px;
`;

const Day = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: ${(props) => {
        if (props.day === '토') return '#1976D2'; // 토요일 - 파란색
        if (props.day === '일') return '#D32F2F'; // 일요일 - 빨간색
        return '#333333'; // 평일 - 기본 색상
    }};
`;

const Date = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #666666;
    margin-top: 2px;
`;

const WorkInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Workplace = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #333333;
`;

const Time = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #666666;
`;

const HoursBadge = styled.div`
    padding: 4px 8px;
    background: #f8f9fa;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: #666666;
    border: 1px solid #e9ecef;
`;
