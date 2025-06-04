import styled from 'styled-components';
import { paymentTypeToKorean } from '../../../utils/paymentUtils';
import { formatNumber } from '../../../utils/formatNumber';
import {
    formatTimeToHHMM,
    getWorkDuration,
} from '../../../utils/timeUtil';

const JobPostWorkInfo = ({
    paymentType,
    payAmount,
    schedules,
}) => {
    const WEEKDAYS_KOR = [
        { key: 'MONDAY', label: '월' },
        { key: 'TUESDAY', label: '화' },
        { key: 'WEDNESDAY', label: '수' },
        { key: 'THURSDAY', label: '목' },
        { key: 'FRIDAY', label: '금' },
        { key: 'SATURDAY', label: '토' },
        { key: 'SUNDAY', label: '일' },
    ];

    const startTime = formatTimeToHHMM(
        schedules[0].startTime
    );
    const endTime = formatTimeToHHMM(schedules[0].endTime);
    const duration = getWorkDuration(startTime, endTime);

    return (
        <WorkInfoBox>
            <WorkInfoLabel>근무 정보</WorkInfoLabel>
            <WorkPayRow>
                <PayChip>
                    {paymentTypeToKorean(paymentType)}
                </PayChip>
                <WorkPayValue>
                    {formatNumber(payAmount)} 원
                </WorkPayValue>
            </WorkPayRow>
            <Row>
                <WorkDayLabel>요일</WorkDayLabel>
                <WorkRow>
                    <WorkDayList>
                        {WEEKDAYS_KOR.map((item) => (
                            <WorkDayItem
                                key={item.key}
                                selected={schedules[0].workingDays.includes(
                                    item.key
                                )}
                            >
                                {item.label}
                            </WorkDayItem>
                        ))}
                    </WorkDayList>
                    <NegotiableTag>협의 가능</NegotiableTag>
                </WorkRow>
            </Row>
            <Row>
                <WorkTimeLabel>시간</WorkTimeLabel>
                <WorkRow>
                    <WorkTimeRow>
                        <WorkTimeValue>
                            {startTime} ~ {endTime}
                        </WorkTimeValue>
                        <WorkTimeSub>
                            {duration}
                        </WorkTimeSub>
                    </WorkTimeRow>
                    <NegotiableTag>협의 가능</NegotiableTag>
                </WorkRow>
            </Row>
        </WorkInfoBox>
    );
};

export default JobPostWorkInfo;

const WorkInfoBox = styled.div`
    width: 390px;
    height: 172px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 20px;
    box-sizing: border-box;
    background-color: #ffffff;
`;

const WorkInfoLabel = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;

const PayChip = styled.div`
    width: 41px;
    height: 24px;
    background-color: #2de283;
    border-radius: 12px;
    outline: 1px solid #d9d9d9;
    outline-offset: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f4f4f4;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.18);
`;

const WorkPayValue = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
`;

const WorkPayRow = styled.div`
    display: flex;
    gap: 8px;
`;

const WorkDayLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    margin-right: 40px;
`;

const WorkDayList = styled.div`
    display: flex;
    gap: 18px;
`;

const WorkDayItem = styled.div`
    font-family: 'Pretendard';
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    // 선택된 경우
    font-weight: ${({ selected }) =>
        selected ? 600 : 400};
    color: ${({ selected }) =>
        selected ? '#111111' : '#999999'};
`;

const NegotiableTag = styled.div`
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    background: #f6f6f6;
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
`;

const Row = styled.div`
    display: flex;
`;

const WorkRow = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
`;

const WorkTimeLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    margin-right: 40px;
`;

const WorkTimeValue = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #111111;
`;

const WorkTimeSub = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
`;

const WorkTimeRow = styled.div`
    display: flex;
    gap: 8px;
`;
