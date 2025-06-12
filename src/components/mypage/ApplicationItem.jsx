import styled from 'styled-components';
import clock from '../../assets/icons/clock.svg';
import calendar from '../../assets/icons/calendar.svg';
import { useState } from 'react';
import { paymentTypeToKorean } from '../../utils/paymentUtils';
import { formatNumber } from '../../utils/formatNumber';
import { getKoreanDays } from '../../utils/weekUtil';
import {
    formatTimeToHHMM,
    timeAgo,
} from '../../utils/timeUtil';
import {
    statusToKorean,
    statusToStyle,
} from '../../utils/statusUtils';
import { cancelApplication } from '../../services/mypage';
import closeIcon from '../../assets/icons/closeIcon.svg';

const ApplicationItem = ({
    id,
    createdAt,
    posting,
    postingSchedule,
    description,
    status,
    onCancelSuccess,
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');
    const { color, background, disable } =
        statusToStyle(status);

    const startTime = formatTimeToHHMM(
        postingSchedule.startTime
    );
    const endTime = formatTimeToHHMM(
        postingSchedule.endTime
    );

    // 지원 취소 버튼 핸들러
    const handleCancel = async () => {
        setIsCancelling(true);
        setCancelError('');
        try {
            await cancelApplication({ applicationId: id });
            setModalOpen(false);
            if (onCancelSuccess) onCancelSuccess();
        } catch (error) {
            setCancelError(error.message || '취소 실패');
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <InfoContainer>
            <TopRow>
                <CompanyName>
                    {posting.workspace.name}
                </CompanyName>
                <Status
                    $color={color}
                    $background={background}
                >
                    {statusToKorean(status)}
                </Status>
            </TopRow>
            <Title>{posting.title}</Title>
            <InfoRow>
                <Description>
                    {paymentTypeToKorean(
                        posting.paymentType
                    )}{' '}
                    <WageHighlight>
                        {formatNumber(posting.payAmount)}
                    </WageHighlight>
                    원 · {timeAgo(createdAt)}
                </Description>
            </InfoRow>
            <InfoRow>
                <InfoGroup>
                    <img src={clock} alt='근무 시간' />
                    <InfoText>
                        {startTime} ~ {endTime}
                    </InfoText>
                </InfoGroup>
                <InfoGroup>
                    <img src={calendar} alt='근무 요일' />
                    <InfoText>
                        {getKoreanDays(
                            postingSchedule.workingDays
                        )}
                    </InfoText>
                </InfoGroup>
            </InfoRow>
            <ButtonRow>
                <CancelButton
                    onClick={handleCancel}
                    disabled={disable}
                >
                    {isCancelling
                        ? '취소 중...'
                        : '지원 취소'}
                </CancelButton>
                <ModalButton
                    onClick={() => setModalOpen(true)}
                >
                    지원내역
                </ModalButton>
            </ButtonRow>

            {modalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalRow>
                            <ModalTitle>
                                지원내역
                            </ModalTitle>
                            <CloseButton
                                src={closeIcon}
                                alt='닫기'
                                onClick={() =>
                                    setModalOpen(false)
                                }
                            />
                        </ModalRow>
                        <ModalHr />
                        <ModalDesc>
                            {description || '없음'}
                        </ModalDesc>
                    </ModalContent>
                </ModalOverlay>
            )}
        </InfoContainer>
    );
};

export default ApplicationItem;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 390px;
    padding: 16px 20px;
    box-sizing: border-box;
    gap: 5px;
    border-bottom: 1px solid #f6f6f6;
`;

const Title = styled.div`
    width: 300px;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    box-sizing: border-box; /* 패딩/보더 포함한 크기 계산 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    white-space: nowrap; /* 줄바꿈 없이 한 줄로 표시 */
    text-overflow: ellipsis; /* 넘치면 ...으로 표시 */
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CompanyName = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    width: 250px;
    box-sizing: border-box; /* 패딩/보더 포함한 크기 계산 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    white-space: nowrap; /* 줄바꿈 없이 한 줄로 표시 */
    text-overflow: ellipsis; /* 넘치면 ...으로 표시 */
`;

const Description = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const WageHighlight = styled.span`
    color: #399982;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
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

const ModalRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const ModalButton = styled.button`
    padding: 8px 16px;
    background: #2de283;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    width: 50%;
    cursor: pointer;
    &:hover {
        background: #1fc270;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    min-width: 200px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ModalTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
`;

const ModalDesc = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
`;

const CancelButton = styled.button`
    padding: 8px 16px;
    border: 1px solid #d9d9d9;
    color: #999999;
    background-color: #ffffff;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    width: 50%;

    &:disabled {
        cursor: not-allowed; /* 금지 마우스 커서 */
    }
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
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
`;

const ModalHr = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid #e0e0e0;
    margin-bottom: 20px;
`;

const CloseButton = styled.img`
    cursor: pointer;
    width: 14px;
    height: 14px;
`;
