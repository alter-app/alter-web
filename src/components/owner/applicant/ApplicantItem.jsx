import styled from 'styled-components';
import Profile from '../../../assets/icons/applicant/Profile.svg';
import TimeCircle from '../../../assets/icons/applicant/TimeCircle.svg';
import Calendar from '../../../assets/icons/workplace/Calendar.svg';
import {
    timeAgo,
    formatTimeToHHMM,
} from '../../../utils/timeUtil';
import { getKoreanDays } from '../../../utils/weekUtil';

const ApplicantItem = ({
    workspace,
    status,
    createdAt,
    schedule,
    applicant,
}) => {
    const startTime = formatTimeToHHMM(schedule.startTime);
    const endTime = formatTimeToHHMM(schedule.endTime);

    const keywords =
        applicant.reputationSummary?.topKeywords || [];

    return (
        <ApplicantContainer>
            <TopSection>
                <WorkplaceName>
                    {workspace.name}
                </WorkplaceName>
                <StatusBadge>
                    {status.description}
                </StatusBadge>
            </TopSection>
            <ProfileInfoSection>
                <InfoGroup>
                    <img src={Profile} alt='이름' />
                    <Name>{applicant.name}</Name>
                </InfoGroup>
                <TimeAgo>{timeAgo(createdAt)}</TimeAgo>
            </ProfileInfoSection>
            <ScheduleInfoSection>
                <InfoGroup>
                    <img
                        src={TimeCircle}
                        alt='희망 근무 시간'
                    />
                    <Time>
                        {startTime} ~ {endTime}
                    </Time>
                </InfoGroup>
                <InfoGroup>
                    <img
                        src={Calendar}
                        alt='희망 근무 요일'
                    />
                    <Date>
                        {getKoreanDays(
                            schedule.workingDays
                        )}
                    </Date>
                </InfoGroup>
            </ScheduleInfoSection>
            <Row>
                <KeywordArea count={keywords.length}>
                    {keywords.map((keyword) => (
                        <KeywordTag key={keyword.id}>
                            {keyword.emoji}{' '}
                            {keyword.description}
                        </KeywordTag>
                    ))}
                </KeywordArea>
            </Row>
        </ApplicantContainer>
    );
};

export default ApplicantItem;

const ApplicantContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 10px;
    padding: 20px;
    width: 350px;
    background: #ffffff;
    border-radius: 25px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
`;

const WorkplaceName = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
`;

const StatusBadge = styled.div`
    border-radius: 12px;
    border: 1px solid #d9d9d9;
    padding: 1px 8px;
    color: #2de283;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.18);
`;

const Name = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
`;

const Time = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
`;

const Date = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
`;

const ProfileInfoSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ScheduleInfoSection = styled.div`
    display: flex;
    gap: 10px;
`;

const InfoGroup = styled.div`
    display: flex;
    gap: 3px;
`;

const TopSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TimeAgo = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const KeywordArea = styled.div`
    display: flex;
    gap: 5px 5px;
    flex-wrap: wrap;
    max-width: ${({ count }) =>
        count === 2 ? '100px' : '350px'};
`;
const KeywordTag = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    background: #ffffff;
    border-radius: 15px;
    border: 1px solid #2de283;
    padding: 5px 10px;
`;
