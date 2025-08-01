import styled from 'styled-components';
import Profile from '../../../assets/icons/applicant/Profile.svg';

const ReputationNotificationItem = () => {
    return (
        <ReputationContainer>
            <TopSection>
                <WorkplaceName>
                    스타벅스 드림팀점
                </WorkplaceName>
                <TimeAgo>32분 전</TimeAgo>
            </TopSection>
            <InfoGroup>
                <img src={Profile} alt='이름' />
                <Name>김경빈</Name>
            </InfoGroup>
            <ButtonSection>
                <AcceptButton>수락</AcceptButton>
                <RejectButton>거절</RejectButton>
            </ButtonSection>
        </ReputationContainer>
    );
};

export default ReputationNotificationItem;

const ReputationContainer = styled.div`
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

const TimeAgo = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const TopSection = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Name = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
`;

const InfoGroup = styled.div`
    display: flex;
    gap: 3px;
`;

const AcceptButton = styled.div`
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    background: #2de283;
    border-radius: 15px;
    padding: 5px 0;
    width: 100%;
    text-align: center;
    cursor: pointer;
`;

const RejectButton = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    background: #ffffff;
    border: 1px solid #2de283;
    border-radius: 15px;
    padding: 5px 0;
    width: 100%;
    text-align: center;
    cursor: pointer;
`;

const ButtonSection = styled.div`
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
`;
