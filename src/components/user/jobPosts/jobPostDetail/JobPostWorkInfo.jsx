import styled from 'styled-components';
import { useState } from 'react';
import { paymentTypeToKorean } from '../../../../utils/paymentUtils';
import { formatNumber } from '../../../../utils/formatNumber';
import {
    formatTimeToHHMM,
    getWorkDuration,
} from '../../../../utils/timeUtil';
import { WEEKDAYS_KOR_ARRAY } from '../../../../utils/weekdayUtils';

const JobPostWorkInfo = ({
    paymentType,
    payAmount,
    schedules,
}) => {
    const [showAllSchedules, setShowAllSchedules] =
        useState(false);


    const visibleSchedules = showAllSchedules
        ? schedules
        : schedules.slice(0, 1);
    const hasMoreSchedules = schedules.length > 1;

    const renderSchedule = (schedule, index) => {
        const startTime = formatTimeToHHMM(
            schedule.startTime
        );
        const endTime = formatTimeToHHMM(schedule.endTime);
        const duration = getWorkDuration(
            startTime,
            endTime
        );

        return (
            <ScheduleCard key={index}>
                {schedules.length > 1 && (
                    <ScheduleCardHeader>
                        {schedule.position}
                    </ScheduleCardHeader>
                )}
                {schedules.length === 1 && (
                    <ScheduleCardHeader>
                        {schedule.position}
                    </ScheduleCardHeader>
                )}
                <ScheduleCardContent>
                    <ScheduleInfoRow>
                        <ScheduleInfoLabel>
                            요일
                        </ScheduleInfoLabel>
                        <ScheduleInfoValue>
                            <WorkDayList>
                                {WEEKDAYS_KOR_ARRAY.map(
                                    (item) => (
                                        <WorkDayItem
                                            key={item.key}
                                            selected={schedule.workingDays.includes(
                                                item.key
                                            )}
                                        >
                                            {item.label}
                                        </WorkDayItem>
                                    )
                                )}
                            </WorkDayList>
                        </ScheduleInfoValue>
                    </ScheduleInfoRow>
                    <ScheduleInfoRow>
                        <ScheduleInfoLabel>
                            시간
                        </ScheduleInfoLabel>
                        <ScheduleInfoValue>
                            <WorkTimeRow>
                                <WorkTimeValue>
                                    {startTime} ~ {endTime}
                                </WorkTimeValue>
                                <WorkTimeSub>
                                    ({duration})
                                </WorkTimeSub>
                            </WorkTimeRow>
                        </ScheduleInfoValue>
                    </ScheduleInfoRow>
                    <ScheduleInfoRow>
                        <ScheduleInfoLabel>
                            인원
                        </ScheduleInfoLabel>
                        <ScheduleInfoValue>
                            <WorkTimeValue>
                                {
                                    schedule.positionsAvailable
                                }
                                명 모집
                            </WorkTimeValue>
                        </ScheduleInfoValue>
                    </ScheduleInfoRow>
                </ScheduleCardContent>
            </ScheduleCard>
        );
    };

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

            {visibleSchedules.map((schedule, index) =>
                renderSchedule(schedule, index)
            )}

            {hasMoreSchedules && (
                <MoreButton
                    onClick={() =>
                        setShowAllSchedules(
                            !showAllSchedules
                        )
                    }
                >
                    {showAllSchedules
                        ? '접기'
                        : `더보기 (${
                              schedules.length - 1
                          }개)`}
                </MoreButton>
            )}
        </WorkInfoBox>
    );
};

export default JobPostWorkInfo;

const WorkInfoBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 20px;
    box-sizing: border-box;
    background-color: #ffffff;

    @media (max-width: 480px) {
        padding: 16px 16px;
        gap: 14px;
    }

    @media (max-width: 360px) {
        padding: 14px 12px;
        gap: 12px;
    }
`;

const WorkInfoLabel = styled.div`
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    @media (max-width: 480px) {
        font-size: 16px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
        line-height: 16px;
    }
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

    @media (max-width: 480px) {
        width: 38px;
        height: 22px;
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        width: 35px;
        height: 20px;
        font-size: 12px;
        line-height: 16px;
    }
`;

const WorkPayValue = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;

    @media (max-width: 480px) {
        font-size: 15px;
        line-height: 22px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
        line-height: 20px;
    }
`;

const WorkPayRow = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: 480px) {
        gap: 6px;
    }

    @media (max-width: 360px) {
        gap: 4px;
    }
`;

const WorkDayLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    margin-right: 40px;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
        margin-right: 30px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
        margin-right: 20px;
    }
`;

const WorkDayList = styled.div`
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 4px;
    gap: 2px;
`;

const WorkDayItem = styled.div`
    font-family: 'Pretendard';
    font-weight: ${props => props.selected ? '700' : '500'};
    font-size: 14px;
    background: ${props => {
        if (props.selected) return '#2de283';
        return '#ffffff';
    }};
    color: ${props => {
        if (props.selected) return '#ffffff';
        return '#767676';
    }};
    border: 1px solid ${props => {
        if (props.selected) return '#2de283';
        return '#e8e8e8';
    }};
    border-radius: 4px;
    min-width: 32px;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
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

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 18px;
        padding: 0 4px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
        padding: 0 3px;
    }
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

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
        margin-right: 30px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
        margin-right: 20px;
    }
`;

const WorkTimeValue = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #111111;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
`;

const WorkTimeSub = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const WorkTimeRow = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: 480px) {
        gap: 6px;
    }

    @media (max-width: 360px) {
        gap: 4px;
    }
`;

const ScheduleCard = styled.div`
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 480px) {
        border-radius: 10px;
        margin-bottom: 10px;
    }

    @media (max-width: 360px) {
        border-radius: 8px;
        margin-bottom: 8px;
    }
`;

const ScheduleCardHeader = styled.div`
    background: #f8f9fa;
    padding: 12px 16px;
    border-bottom: 1px solid #e8e8e8;
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    @media (max-width: 480px) {
        padding: 10px 14px;
        font-size: 15px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        padding: 8px 12px;
        font-size: 14px;
        line-height: 16px;
    }
`;

const ScheduleCardContent = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media (max-width: 480px) {
        padding: 14px;
        gap: 10px;
    }

    @media (max-width: 360px) {
        padding: 12px;
        gap: 8px;
    }
`;

const ScheduleInfoRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;

    @media (max-width: 480px) {
        gap: 10px;
    }

    @media (max-width: 360px) {
        gap: 8px;
    }
`;

const ScheduleInfoLabel = styled.div`
    min-width: 40px;
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;

    @media (max-width: 480px) {
        font-size: 12px;
        line-height: 16px;
        min-width: 35px;
    }

    @media (max-width: 360px) {
        font-size: 11px;
        line-height: 14px;
        min-width: 30px;
    }
`;

const ScheduleInfoValue = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ScheduleCardFooter = styled.div`
    background: #f8f9fa;
    padding: 8px 16px;
    border-top: 1px solid #e8e8e8;
    display: flex;
    justify-content: flex-end;

    @media (max-width: 480px) {
        padding: 6px 14px;
    }

    @media (max-width: 360px) {
        padding: 4px 12px;
    }
`;

const MoreButton = styled.button`
    width: 100%;
    padding: 12px 0;
    background: none;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f8f8f8;
        border-color: #d0d0d0;
    }

    &:active {
        background: #f0f0f0;
        transform: scale(0.98);
    }

    @media (max-width: 480px) {
        padding: 10px 0;
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        padding: 8px 0;
        font-size: 12px;
        line-height: 16px;
    }
`;
