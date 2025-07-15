import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import deleteIcon from '../../../assets/icons/deleteIcon.svg';
import { sortWeekdays } from '../../../utils/weekUtil';
import { autoInsertColon } from '../../../utils/timeUtil';

const days = [
    { label: '월', value: 'MONDAY' },
    { label: '화', value: 'TUESDAY' },
    { label: '수', value: 'WEDNESDAY' },
    { label: '목', value: 'THURSDAY' },
    { label: '금', value: 'FRIDAY' },
    { label: '토', value: 'SATURDAY' },
    { label: '일', value: 'SUNDAY' },
];

const WorkScheduleItem = ({
    schedule,
    index,
    onChange,
    onRemove,
}) => {
    // props로 받은 값으로 상태 초기화 (상위에서 관리하므로 useEffect로 동기화)
    const [selectedDays, setSelectedDays] = useState(
        schedule.workingDays || []
    );
    const [startTime, setStartTime] = useState(
        schedule.startTime || ''
    );
    const [endTime, setEndTime] = useState(
        schedule.endTime || ''
    );

    useEffect(() => {
        setSelectedDays(schedule.workingDays || []);
        setStartTime(schedule.startTime || '');
        setEndTime(schedule.endTime || '');
    }, [schedule]);

    // 요일 클릭 시
    const handleDayToggle = (value) => {
        let next;
        if (selectedDays.includes(value)) {
            next = selectedDays.filter((v) => v !== value);
        } else {
            next = [...selectedDays, value];
        }
        setSelectedDays(next);
        if (onChange)
            onChange({ workingDays: sortWeekdays(next) });
    };

    // 시간 입력 핸들러
    const handleStartTimeChange = (e) => {
        const formatted = autoInsertColon(e.target.value);
        setStartTime(formatted);
        if (onChange) onChange({ startTime: formatted });
    };
    const handleEndTimeChange = (e) => {
        const formatted = autoInsertColon(e.target.value);
        setEndTime(formatted);
        if (onChange) onChange({ endTime: formatted });
    };

    return (
        <ScheduleItemContainer>
            <TopRow>
                <ScheduleTitle>일정 {index}</ScheduleTitle>
                <img
                    src={deleteIcon}
                    alt='닫기'
                    style={{ cursor: 'pointer' }}
                    onClick={onRemove}
                />
            </TopRow>
            <Row>
                <Column>
                    <WeekDiv>
                        <WeekdayLabel>
                            근무요일
                        </WeekdayLabel>
                        <WorkingDaysCategory>
                            {days.map((day) => (
                                <DayBox
                                    key={day.value}
                                    $isSelected={selectedDays.includes(
                                        day.value
                                    )}
                                    onClick={() =>
                                        handleDayToggle(
                                            day.value
                                        )
                                    }
                                >
                                    {day.label}
                                </DayBox>
                            ))}
                        </WorkingDaysCategory>
                    </WeekDiv>
                    <TimeGap>
                        <NegotiableTimeWrapper>
                            요일 협의가능
                        </NegotiableTimeWrapper>
                        <StyledCheckbox />
                    </TimeGap>
                </Column>
                <Divider />
                <Column>
                    <WeekDiv>
                        <WorkTimeLabel>
                            근무시간
                        </WorkTimeLabel>
                        <TimeGap>
                            <TimeInput
                                placeholder='시작시간'
                                value={startTime}
                                onChange={
                                    handleStartTimeChange
                                }
                            />
                            <TimeInput
                                placeholder='종료시간'
                                value={endTime}
                                onChange={
                                    handleEndTimeChange
                                }
                            />
                        </TimeGap>
                    </WeekDiv>
                    <TimeGap>
                        <NegotiableTimeWrapper>
                            시간 협의가능
                        </NegotiableTimeWrapper>
                        <StyledCheckbox />
                    </TimeGap>
                </Column>
            </Row>
        </ScheduleItemContainer>
    );
};

export default WorkScheduleItem;

const ScheduleItemContainer = styled.div`
    width: 780px;
    height: 160px;
    background-color: #ffffff;
    border: solid 1px #d9d9d9;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px;
`;

const ScheduleTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #767676;
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 74px;
`;

const WeekdayLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;
`;

const WorkTimeLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;
`;

const WorkingDaysCategory = styled.div`
    display: flex;
    gap: 13px;
`;

const DayBox = styled.button`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    border: solid 1px #d9d9d9;
    background-color: #ffffff;
    cursor: pointer;

    ${({ $isSelected }) =>
        $isSelected &&
        css`
            color: #ffffff;
            background: #2de283;
            border: none;
        `}
`;

const Divider = styled.div`
    width: 1px;
    height: 88px;
    background: #d9d9d9;
`;

const TimeInput = styled.input`
    width: 142px;
    height: 48px;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 8px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }
`;

const NegotiableTimeWrapper = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #767676;
`;

const StyledCheckbox = styled.input.attrs({
    type: 'checkbox',
})`
    accent-color: #2de283;
    margin: 0px;
`;

const TimeGap = styled.div`
    display: flex;
    justify-content: end;
    gap: 4px;
`;

const WeekDiv = styled.div`
    height: 48px;
    gap: 16px;
    display: flex;
    align-items: center;
`;
