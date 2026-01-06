import styled from 'styled-components';

const ScheduleItem = ({
    schedule,
    onClick,
    isClickable = false,
}) => {
    const isUnassigned = !schedule?.assignedWorker;
    const workerName =
        schedule?.assignedWorker?.workerName || '미배정';
    const position = schedule?.position || '직원';
    const startTime = schedule?.startDateTime
        ? new Date(
              schedule.startDateTime
          ).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';
    const endTime = schedule?.endDateTime
        ? new Date(schedule.endDateTime).toLocaleTimeString(
              'ko-KR',
              {
                  hour: '2-digit',
                  minute: '2-digit',
              }
          )
        : '';

    return (
        <Container
            onClick={onClick}
            $isClickable={isClickable || isUnassigned}
        >
            <WorkerInfo>
                <WorkerName $isUnassigned={isUnassigned}>
                    {workerName}
                </WorkerName>
                <Position>{position}</Position>
            </WorkerInfo>
            <TimeInfo>
                <TimeRange>
                    {startTime}
                    {endTime && ` - ${endTime}`}
                </TimeRange>
            </TimeInfo>
        </Container>
    );
};

export default ScheduleItem;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    border-left: 4px solid #399982;
    cursor: ${(props) =>
        props.$isClickable ? 'pointer' : 'default'};
    transition: all 0.2s ease;

    ${(props) =>
        props.$isClickable &&
        `
        &:hover {
            background: #e8f5f0;
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
    `}
`;

const WorkerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const WorkerName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: ${(props) =>
        props.$isUnassigned ? '#e53e3e' : '#333333'};
`;

const Position = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const TimeInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
`;

const TimeRange = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #399982;
`;
