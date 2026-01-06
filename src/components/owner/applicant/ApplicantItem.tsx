import styled from 'styled-components';
import Profile from '../../../assets/icons/applicant/Profile.svg';
import TimeCircle from '../../../assets/icons/applicant/TimeCircle.svg';
import Calendar from '../../../assets/icons/workplace/Calendar.svg';
import { timeAgo, formatTimeToHHMM } from '../../../utils/timeUtil';
import { getKoreanDays } from '../../../utils/weekUtil';

interface ApplicantItemProps {
    workspace: {
        name?: string;
        [key: string]: unknown;
    };
    status: {
        description?: string;
        [key: string]: unknown;
    };
    createdAt?: string;
    schedule: {
        startTime: string;
        endTime: string;
        workingDays?: string[];
        [key: string]: unknown;
    };
    applicant: {
        name?: string;
        reputationSummary?: {
            topKeywords?: Array<{
                id?: string | number;
                emoji?: string;
                description?: string;
                [key: string]: unknown;
            }>;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
}

const ApplicantItem = ({
    workspace,
    status,
    createdAt,
    schedule,
    applicant,
}: ApplicantItemProps) => {
    const startTime = formatTimeToHHMM(schedule.startTime);
    const endTime = formatTimeToHHMM(schedule.endTime);

    const keywords = applicant.reputationSummary?.topKeywords || [];

    return (
        <ApplicantContainer>
            <TopSection>
                <WorkplaceName>{workspace.name}</WorkplaceName>
                <StatusBadge>{status.description}</StatusBadge>
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
                    <img src={TimeCircle} alt='희망 근무 시간' />
                    <Time>
                        {startTime} ~ {endTime}
                    </Time>
                </InfoGroup>
                <InfoGroup>
                    <img src={Calendar} alt='희망 근무 요일' />
                    <Date>{getKoreanDays(schedule.workingDays || [])}</Date>
                </InfoGroup>
            </ScheduleInfoSection>
            <Row>
                <KeywordArea count={keywords.length}>
                    {keywords.map((keyword: { id?: string | number; emoji?: string; description?: string; [key: string]: unknown }) => (
                        <KeywordTag key={keyword.id}>
                            {keyword.emoji} {keyword.description}
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
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: #2de283;
    }

    &:active {
        transform: translateY(0);
    }
`;

const TopSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0;
    flex: 1;
`;

const StatusBadge = styled.div`
    padding: 6px 12px;
    border-radius: 20px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    background: #2de283;
    white-space: nowrap;
`;

const ProfileInfoSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ScheduleInfoSection = styled.div`
    display: flex;
    gap: 8px;
`;

const InfoGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const Name = styled.span`
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
`;

const Time = styled.span`
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
`;

const Date = styled.span`
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
`;

const TimeAgo = styled.span`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

interface KeywordAreaProps {
    count?: number;
}

const KeywordArea = styled.div<KeywordAreaProps>`
    display: flex;
    gap: 5px 5px;
    flex-wrap: wrap;
    max-width: ${({ count }) => (count === 2 ? '100px' : '350px')};
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
