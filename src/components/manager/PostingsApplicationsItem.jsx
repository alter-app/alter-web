import styled from 'styled-components';
import clock from '../../assets/icons/clock.svg';
import calendar from '../../assets/icons/calendar.svg';
import { useState } from 'react';
import { getKoreanDays } from '../../utils/weekUtil';
import {
    formatTimeToHHMM,
    timeAgo,
} from '../../utils/timeUtil';
import {
    statusToKorean,
    statusToStyle,
} from '../../utils/statusUtils';
import { formatBirthday } from '../../utils/weekUtil';
import { genderToKorean } from '../../utils/genderUtils';
import {
    getPostingsApplicationDetail,
    updateApplicationStatus,
} from '../../services/managerPage';

const PostingsApplicationsItem = ({
    id,
    createdAt,
    status,
    workspaceName,
    schedule,
}) => {
    const [cancelError, setCancelError] = useState('');
    const [showActions, setShowActions] = useState(false);
    const [description, setDescription] = useState('');
    const [applicationDetail, setApplicationDetail] =
        useState([]);
    const [currentStatus, setCurrentStatus] =
        useState(status);
    const { color, background, disable } =
        statusToStyle(currentStatus);

    const startTime = formatTimeToHHMM(schedule.startTime);
    const endTime = formatTimeToHHMM(schedule.endTime);

    const fetchApplicationDetail = async () => {
        try {
            const response =
                await getPostingsApplicationDetail(id);
            setApplicationDetail(response.data.applicant);
            setDescription(response.data.description);
            console.log(applicationDetail);
        } catch (error) {
            console.error('지원 상세 조회 실패:', error);
            setCancelError(
                error.message || '상세 조회 실패'
            );
        }
    };

    const handleUpdateStatus = async (nextStatus) => {
        try {
            await updateApplicationStatus({
                postingApplicationId: id,
                status: nextStatus,
            });
            setCurrentStatus(nextStatus);
            console.log(
                `지원자가 ${
                    nextStatus === 'ACCEPTED'
                        ? '수락'
                        : '거절'
                }되었습니다.`
            );
        } catch (error) {
            console.log(
                error.message || '상태 변경 중 오류 발생'
            );
        }
    };

    return (
        <InfoContainer>
            <Row>
                <LeftColumn>
                    <CompanyName>
                        {workspaceName}
                    </CompanyName>
                    <InfoText>
                        {timeAgo(createdAt)} 작성됨
                    </InfoText>
                    <InfoRow>
                        <InfoGroup>
                            <img
                                src={clock}
                                alt='근무 시간'
                            />
                            <InfoText>
                                {startTime} ~ {endTime}
                            </InfoText>
                        </InfoGroup>
                        <InfoGroup>
                            <img
                                src={calendar}
                                alt='근무 요일'
                            />
                            <InfoText>
                                {getKoreanDays(
                                    schedule.workingDays
                                )}
                            </InfoText>
                        </InfoGroup>
                    </InfoRow>
                </LeftColumn>
                <Status
                    $color={color}
                    $background={background}
                >
                    {statusToKorean(currentStatus)}
                </Status>
            </Row>
            <ButtonRow>
                <DetailToggleButton
                    onClick={() => {
                        if (!showActions)
                            fetchApplicationDetail();
                        setShowActions(!showActions);
                    }}
                >
                    {showActions
                        ? '접기 ▲'
                        : '지원 내역 보기 ▼'}
                </DetailToggleButton>
            </ButtonRow>
            {showActions && (
                <>
                    {applicationDetail && (
                        <>
                            <Title>지원자 정보</Title>
                            <ApplicantInfoBox>
                                <InfoRowItem>
                                    <InfoLabel>
                                        지원자명
                                    </InfoLabel>
                                    <InfoValue>
                                        {
                                            applicationDetail.name
                                        }
                                    </InfoValue>
                                </InfoRowItem>
                                <InfoRowItem>
                                    <InfoLabel>
                                        성별
                                    </InfoLabel>
                                    <InfoValue>
                                        {genderToKorean(
                                            applicationDetail.gender
                                        )}
                                    </InfoValue>
                                </InfoRowItem>
                                <InfoRowItem>
                                    <InfoLabel>
                                        생년월일
                                    </InfoLabel>
                                    <InfoValue>
                                        {formatBirthday(
                                            applicationDetail.birthday
                                        )}
                                    </InfoValue>
                                </InfoRowItem>
                                <InfoRowItem>
                                    <InfoLabel>
                                        연락처
                                    </InfoLabel>
                                    <InfoValue>
                                        {
                                            applicationDetail.contact
                                        }
                                    </InfoValue>
                                </InfoRowItem>
                                <InfoRowItem>
                                    <InfoLabel>
                                        이메일
                                    </InfoLabel>
                                    <InfoValue>
                                        {
                                            applicationDetail.email
                                        }
                                    </InfoValue>
                                </InfoRowItem>
                            </ApplicantInfoBox>
                            <Title>자기소개</Title>
                            <ApplicantInfoBox>
                                <Description>
                                    {description || '없음'}
                                </Description>
                            </ApplicantInfoBox>
                            <Title>자격증</Title>
                            <ApplicantInfoBox>
                                {applicationDetail.userCertificates &&
                                applicationDetail
                                    .userCertificates
                                    .length > 0 ? (
                                    applicationDetail.userCertificates.map(
                                        (cert) => (
                                            <ItemRow
                                                key={
                                                    cert.certificateId ||
                                                    cert.id
                                                }
                                            >
                                                <ColumnLeft>
                                                    <CertName>
                                                        {
                                                            cert.certificateName
                                                        }
                                                    </CertName>
                                                    <Publisher>
                                                        {cert.publisherName ||
                                                            '-'}
                                                    </Publisher>
                                                </ColumnLeft>
                                                <IssuedDate>
                                                    {cert.issuedAt ||
                                                        '-'}
                                                </IssuedDate>
                                            </ItemRow>
                                        )
                                    )
                                ) : (
                                    <div>없음</div>
                                )}
                            </ApplicantInfoBox>
                        </>
                    )}
                    <ButtonRow>
                        <AcceptButton
                            onClick={() =>
                                handleUpdateStatus(
                                    'ACCEPTED'
                                )
                            }
                        >
                            수락
                        </AcceptButton>
                        <RejectButton
                            onClick={() =>
                                handleUpdateStatus(
                                    'REJECTED'
                                )
                            }
                        >
                            거절
                        </RejectButton>
                    </ButtonRow>
                </>
            )}
        </InfoContainer>
    );
};

export default PostingsApplicationsItem;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 16px 20px;
    box-sizing: border-box;
    gap: 10px;
    border-bottom: 1px solid #f6f6f6;
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CompanyName = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    width: 250px;
    box-sizing: border-box; /* 패딩/보더 포함한 크기 계산 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    white-space: nowrap; /* 줄바꿈 없이 한 줄로 표시 */
    text-overflow: ellipsis; /* 넘치면 ...으로 표시 */
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const InfoGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const InfoText = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    text-align: center;
`;

const Status = styled.div`
    padding: 2px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    outline: 1px solid #d9d9d9;
    background-color: ${({ $background }) =>
        $background || '#ffffff'};
    color: ${({ $color }) => $color || '#2de283'};
    outline-offset: -1px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
`;

const AcceptButton = styled.button`
    flex: 1;
    padding: 10px 0;
    font-size: 14px;
    border-radius: 4px;
    font-family: 'Pretendard';
    line-height: 20px;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    background-color: #2de283;
    color: #ffffff;
    border: none;

    &:hover {
        background-color: #1fc270;
    }
`;

const RejectButton = styled.button`
    flex: 1;
    padding: 10px 0;
    font-size: 14px;
    border-radius: 4px;
    font-family: 'Pretendard';
    line-height: 20px;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    background-color: #ffffff;
    color: #dc0000;
    border: 1px solid #dc0000;

    &:hover {
        background-color: #ffeaea;
    }
`;

const DetailToggleButton = styled.button`
    width: 100%;
    padding: 10px 0;
    font-size: 14px;
    border-radius: 4px;
    font-family: 'Pretendard';
    line-height: 20px;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    background-color: #ffffff;
    color: #2de283;
    border: 1px solid #2de283;

    &:hover {
        background-color: #e6fff3;
    }
`;

const ApplicantInfoBox = styled.div`
    width: 100%;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    margin-bottom: 15px;
`;

const InfoRowItem = styled.div`
    display: flex;
    justify-content: space-between;
`;

const InfoLabel = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
`;

const InfoValue = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const Title = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    padding-left: 4px;
`;

const ItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

const ColumnLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const CertName = styled.div`
    color: #555555;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
`;

const Publisher = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
`;

const IssuedDate = styled.div`
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
`;

const Description = styled.div`
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;
