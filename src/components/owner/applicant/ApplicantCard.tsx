import styled from 'styled-components';
import { useState } from 'react';
import {
    getPostingsApplicationDetail,
    updateApplicationStatus,
} from '../../../services/managerPage';
import {
    formatTimeToHHMM,
    timeAgo,
} from '../../../utils/timeUtil';
import { getKoreanDays } from '../../../utils/weekUtil';
import { formatBirthday } from '../../../utils/weekUtil';
import { genderToKorean } from '../../../utils/genderUtils';
import { statusToStyle } from '../../../utils/statusUtils';
import ConfirmModal from '../ConfirmModal';
import Profile from '../../../assets/icons/applicant/Profile.svg';
import TimeCircle from '../../../assets/icons/applicant/TimeCircle.svg';
import Calendar from '../../../assets/icons/workplace/Calendar.svg';

interface Application {
    id: string | number;
    status: {
        value: string;
        description?: string;
    };
    schedule: {
        startTime: string;
        endTime: string;
        workingDays?: string[];
        [key: string]: unknown;
    };
    applicant?: {
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
    workspace?: {
        name?: string;
        [key: string]: unknown;
    };
    createdAt?: string;
    [key: string]: unknown;
}

interface ApplicantDetail {
    name?: string;
    gender?: string;
    birthday?: string;
    contact?: string;
    email?: string;
    reputationSummary?: {
        summaryDescription?: string;
    };
    userCertificates?: Array<{
        certificateId?: string | number;
        name?: string;
        [key: string]: unknown;
    }>;
    [key: string]: unknown;
}

interface ApplicantCardProps {
    application: Application;
}

const ApplicantCard = ({ application }: ApplicantCardProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const [applicationDetail, setApplicationDetail] =
        useState<ApplicantDetail | null>(null);
    const [description, setDescription] = useState('');
    const [showConfirmModal, setShowConfirmModal] =
        useState(false);
    const [pendingStatus, setPendingStatus] =
        useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState(
        application.status
    );

    const { color, background } = statusToStyle(
        currentStatus.value
    );

    const startTime = formatTimeToHHMM(
        application.schedule.startTime
    );
    const endTime = formatTimeToHHMM(
        application.schedule.endTime
    );

    const fetchApplicationDetail = async () => {
        try {
            const response =
                await getPostingsApplicationDetail(
                    application.id
                ) as { data: { applicant: ApplicantDetail; description: string } };
            setApplicationDetail(response.data.applicant);
            setDescription(response.data.description);
        } catch (error) {
            console.error('지원 상세 조회 실패:', error);
        }
    };

    const handleToggleDetails = () => {
        if (!showDetails) {
            fetchApplicationDetail();
        }
        setShowDetails(!showDetails);
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateApplicationStatus({
                postingApplicationId: application.id,
                status: status,
            });
            setCurrentStatus((prev: { value: string; description?: string }) => ({
                ...prev,
                value: status,
            }));
            setShowConfirmModal(false);
            window.location.reload();
        } catch (error) {
            console.error('상태 변경 오류:', error);
        }
    };

    const keywords =
        application.applicant?.reputationSummary
            ?.topKeywords || [];

    return (
        <>
            <Card>
                <TopSection>
                    <WorkplaceName>
                        {application.workspace?.name || '알 수 없는 업장'}
                    </WorkplaceName>
                    <StatusTag
                        $color={color}
                        $background={background}
                    >
                        {currentStatus.description}
                    </StatusTag>
                </TopSection>

                <ProfileInfoSection>
                    <InfoGroup>
                        <img src={Profile} alt='이름' />
                        <Name>
                            {application.applicant?.name || '알 수 없는 지원자'}
                        </Name>
                    </InfoGroup>
                    <TimeAgo>
                        {timeAgo(application.createdAt)}
                    </TimeAgo>
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
                                application.schedule
                                    ?.workingDays || []
                            )}
                        </Date>
                    </InfoGroup>
                </ScheduleInfoSection>

                {keywords.length > 0 && (
                    <Row>
                        <KeywordArea
                            count={keywords.length}
                        >
                            {keywords.map((keyword: { id?: string | number; emoji?: string; description?: string; [key: string]: unknown }) => (
                                <KeywordTag
                                    key={keyword.id}
                                >
                                    {keyword.emoji}{' '}
                                    {keyword.description}
                                </KeywordTag>
                            ))}
                        </KeywordArea>
                    </Row>
                )}

                <CardFooter>
                    <DetailButton
                        onClick={handleToggleDetails}
                    >
                        {showDetails
                            ? '접기 ▲'
                            : '지원 내역 보기 ▼'}
                    </DetailButton>
                </CardFooter>

                {showDetails && applicationDetail && (
                    <DetailSection>
                        <DetailTitle>
                            지원자 정보
                        </DetailTitle>
                        <DetailBox>
                            <DetailRow>
                                <DetailLabel>
                                    지원자명
                                </DetailLabel>
                                <DetailValue>
                                    {applicationDetail.name}
                                </DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>
                                    성별
                                </DetailLabel>
                                <DetailValue>
                                    {genderToKorean(
                                        applicationDetail.gender || ''
                                    )}
                                </DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>
                                    생년월일
                                </DetailLabel>
                                <DetailValue>
                                    {formatBirthday(
                                        applicationDetail.birthday
                                    )}
                                </DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>
                                    연락처
                                </DetailLabel>
                                <DetailValue>
                                    {
                                        applicationDetail.contact
                                    }
                                </DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>
                                    이메일
                                </DetailLabel>
                                <DetailValue>
                                    {
                                        applicationDetail.email
                                    }
                                </DetailValue>
                            </DetailRow>
                        </DetailBox>

                        <DetailTitle>자기소개</DetailTitle>
                        <DetailBox>
                            <DetailText>
                                {description || '없음'}
                            </DetailText>
                        </DetailBox>

                        <DetailTitle>
                            AI 평판 요약
                        </DetailTitle>
                        <AIDetailBox>
                            <AIBadge>AI</AIBadge>
                            <DetailText>
                                {applicationDetail
                                    ?.reputationSummary
                                    ?.summaryDescription ||
                                    '없음'}
                            </DetailText>
                        </AIDetailBox>

                        <DetailTitle>자격증</DetailTitle>
                        <DetailBox>
                            {applicationDetail.userCertificates &&
                            applicationDetail
                                .userCertificates.length >
                                0 ? (
                                applicationDetail.userCertificates.map(
                                    (cert: { certificateId?: string | number; id?: string | number; certificateName?: string; publisherName?: string; issuedAt?: string; [key: string]: unknown }) => (
                                        <CertRow
                                            key={
                                                cert.certificateId ||
                                                cert.id
                                            }
                                        >
                                            <CertLeft>
                                                <CertName>
                                                    {
                                                        cert.certificateName
                                                    }
                                                </CertName>
                                                <CertPublisher>
                                                    {cert.publisherName ||
                                                        '-'}
                                                </CertPublisher>
                                            </CertLeft>
                                            <CertDate>
                                                {cert.issuedAt ||
                                                    '-'}
                                            </CertDate>
                                        </CertRow>
                                    )
                                )
                            ) : (
                                <DetailText>
                                    없음
                                </DetailText>
                            )}
                        </DetailBox>

                        <ActionButtons>
                            <AcceptButton
                                onClick={() => {
                                    setPendingStatus(
                                        'ACCEPTED'
                                    );
                                    setShowConfirmModal(
                                        true
                                    );
                                }}
                            >
                                수락
                            </AcceptButton>
                            <RejectButton
                                onClick={() => {
                                    setPendingStatus(
                                        'REJECTED'
                                    );
                                    setShowConfirmModal(
                                        true
                                    );
                                }}
                            >
                                거절
                            </RejectButton>
                        </ActionButtons>
                    </DetailSection>
                )}
            </Card>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setPendingStatus(null);
                }}
                onConfirm={() => {
                    if (pendingStatus) {
                        handleUpdateStatus(pendingStatus);
                    }
                }}
                title="상태 변경"
                message={`정말로 ${pendingStatus === 'ACCEPTED' ? '수락' : '거절'}하시겠습니까?`}
                confirmText={pendingStatus === 'ACCEPTED' ? '수락' : '거절'}
                cancelText="취소"
            />
        </>
    );
};

export default ApplicantCard;

const Card = styled.div`
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

interface StatusTagProps {
    $color?: string;
    $background?: string;
}

const StatusTag = styled.div<StatusTagProps>`
    padding: 6px 12px;
    border-radius: 20px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: ${(props) => props.$color};
    background: ${(props) => props.$background};
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

const CardFooter = styled.div`
    margin-top: 4px;
`;

const DetailButton = styled.button`
    width: 100%;
    padding: 10px 0;
    border: 1px solid #2de283;
    border-radius: 8px;
    background: #ffffff;
    color: #2de283;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f0fff7;
        border-color: #1fc270;
    }

    &:active {
        transform: scale(0.98);
    }
`;

const DetailSection = styled.div`
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
`;

const DetailTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 15px;
    color: #333333;
    margin-bottom: 12px;
`;

const DetailBox = styled.div`
    background: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
`;

const DetailLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const DetailValue = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #333333;
`;

const DetailText = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 1.5;
`;

const AIDetailBox = styled(DetailBox)`
    background: #f0fff7;
    border: 1px solid #2de283;
    position: relative;
`;

const AIBadge = styled.div`
    position: absolute;
    top: -10px;
    right: 12px;
    background: #2de283;
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 6px;
`;

const CertRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

const CertLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const CertName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #555555;
`;

const CertPublisher = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #999999;
`;

const CertDate = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #666666;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const AcceptButton = styled.button`
    flex: 1;
    padding: 12px 0;
    background: #2de283;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #1fc270;
    }
`;

const RejectButton = styled.button`
    flex: 1;
    padding: 12px 0;
    background: #ffffff;
    color: #dc0000;
    border: 1px solid #dc0000;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #ffeaea;
    }
`;
