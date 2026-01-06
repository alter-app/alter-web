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
    const [position, setPosition] = useState(
        schedule.position || ''
    );
    const [positionsNeeded, setPositionsNeeded] = useState(
        schedule.positionsNeeded || 1
    );

    useEffect(() => {
        setSelectedDays(schedule.workingDays || []);
        setStartTime(schedule.startTime || '');
        setEndTime(schedule.endTime || '');
        setPosition(schedule.position || '');
        setPositionsNeeded(schedule.positionsNeeded || 1);
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

    // 포지션 입력 핸들러
    const handlePositionChange = (e) => {
        const value = e.target.value;
        setPosition(value);
        if (onChange) onChange({ position: value });
    };

    // 필요 인원 수 입력 핸들러
    const handlePositionsNeededChange = (e) => {
        const inputValue = e.target.value;

        // 빈 값이면 빈 값으로 설정 (입력 중에는 자유롭게 입력 가능)
        if (inputValue === '') {
            setPositionsNeeded('');
            return;
        }

        // 숫자만 허용
        const numValue = parseInt(inputValue);
        if (isNaN(numValue)) {
            return; // 숫자가 아니면 무시
        }

        // 입력 중에는 자유롭게 입력 가능 (blur 시에만 최소값 검증)
        setPositionsNeeded(numValue);
        if (onChange)
            onChange({ positionsNeeded: numValue });
    };

    // blur 시 최소값 보장
    const handlePositionsNeededBlur = (e) => {
        const inputValue = e.target.value;
        const numValue = parseInt(inputValue);
        // 빈 값이거나 1보다 작으면 1로 설정
        if (
            !inputValue ||
            isNaN(numValue) ||
            numValue < 1
        ) {
            const validValue = 1;
            setPositionsNeeded(validValue);
            if (onChange)
                onChange({ positionsNeeded: validValue });
        }
    };

    return (
        <ScheduleItemContainer>
            <TopRow>
                <ScheduleTitle>일정 {index}</ScheduleTitle>
                {onRemove && (
                    <img
                        src={deleteIcon}
                        alt='닫기'
                        style={{ cursor: 'pointer' }}
                        onClick={onRemove}
                    />
                )}
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
                </Column>
                <Divider />
                <Column>
                    <WeekDiv>
                        <WorkTimeLabel>
                            근무시간
                        </WorkTimeLabel>
                        <TimeGap $isTimeInput>
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
                </Column>
            </Row>
            <Row $hasMarginTop>
                <Column>
                    <WeekDiv>
                        <WeekdayLabel>포지션</WeekdayLabel>
                        <PositionInput
                            placeholder='예: 홀서빙, 설거지'
                            value={position}
                            onChange={handlePositionChange}
                        />
                    </WeekDiv>
                </Column>
                <Divider />
                <Column>
                    <WeekDiv>
                        <WorkTimeLabel>
                            필요 인원
                        </WorkTimeLabel>
                        <PositionsNeededInput
                            type='number'
                            min='1'
                            placeholder='인원 수'
                            value={positionsNeeded}
                            onChange={
                                handlePositionsNeededChange
                            }
                            onBlur={
                                handlePositionsNeededBlur
                            }
                        />
                    </WeekDiv>
                </Column>
            </Row>
        </ScheduleItemContainer>
    );
};

export default WorkScheduleItem;

const ScheduleItemContainer = styled.div`
    width: 100%;
    max-width: 780px;
    min-height: 160px;
    background-color: #ffffff;
    border: solid 1px #d9d9d9;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px;

    @media (max-width: 768px) {
        padding: 16px 12px;
        min-height: auto;
    }
`;

const ScheduleTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #767676;

    @media (max-width: 768px) {
        font-size: 15px;
        line-height: 22px;
    }
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    @media (max-width: 768px) {
        margin-bottom: 12px;
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: ${(props) =>
        props.$hasMarginTop ? '16px' : '0'};

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;

    @media (max-width: 768px) {
        width: 100%;
        gap: 12px;
    }
`;

const WeekdayLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;

    @media (max-width: 768px) {
        font-size: 14px;
        line-height: 20px;
    }
`;

const WorkTimeLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;

    @media (max-width: 768px) {
        font-size: 14px;
        line-height: 20px;
    }
`;

const WorkingDaysCategory = styled.div`
    display: flex;
    gap: 13px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        gap: 8px;
    }
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
    touch-action: manipulation;

    ${({ $isSelected }) =>
        $isSelected &&
        css`
            color: #ffffff;
            background: #2de283;
            border: none;
        `}

    @media (max-width: 768px) {
        width: 36px;
        height: 36px;
        font-size: 14px;
    }
`;

const Divider = styled.div`
    width: 1px;
    height: 48px;
    background: #d9d9d9;

    @media (max-width: 768px) {
        display: none;
    }
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
    flex: 1;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }

    @media (max-width: 768px) {
        flex: 1;
        min-width: 0;
    }
`;

const NegotiableTimeWrapper = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #767676;

    @media (max-width: 768px) {
        font-size: 13px;
        line-height: 18px;
    }
`;

const StyledCheckbox = styled.input.attrs({
    type: 'checkbox',
})`
    accent-color: #2de283;
    margin: 0px;
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

const TimeGap = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    align-items: center;

    @media (max-width: 768px) {
        justify-content: flex-start;
        flex-direction: row;
        gap: 8px;
        width: 100%;
    }
`;

const WeekDiv = styled.div`
    height: 48px;
    gap: 16px;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        gap: 12px;
        width: 100%;
    }
`;

const PositionInput = styled.input`
    width: 200px;
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
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const PositionsNeededInput = styled.input`
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
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;
