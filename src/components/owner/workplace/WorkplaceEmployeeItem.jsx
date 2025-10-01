import user_icon_list from '../../../assets/icons/workplace/user_icon_list.svg';
import phone_icon from '../../../assets/icons/workplace/phone_icon.svg';
import styled from 'styled-components';

const WorkplaceEmployeeItem = ({
    status,
    user,
    position,
    employedAt,
    nextShiftDateTime,
}) => {
    return (
        <Container>
            <TopRow>
                <IconSection>
                    <img src={user_icon_list} alt='이름' />
                    <Info>{user?.name || '이름 없음'}</Info>
                </IconSection>
                <StatusBadge status={status?.description}>
                    {status?.description || '상태 없음'}
                </StatusBadge>
            </TopRow>
            <IconSection>
                <img src={phone_icon} alt='전화번호' />
                <Info>
                    {user?.contact || '연락처 없음'}
                </Info>
            </IconSection>
            {position && (
                <PositionSection>
                    <PositionEmoji>
                        {position.emoji || '👤'}
                    </PositionEmoji>
                    <PositionText>
                        {position.description ||
                            '직책 없음'}
                    </PositionText>
                </PositionSection>
            )}
            {employedAt && (
                <InfoSection>
                    <InfoLabel>입사일:</InfoLabel>
                    <InfoValue>{employedAt}</InfoValue>
                </InfoSection>
            )}
            {nextShiftDateTime && (
                <InfoSection>
                    <InfoLabel>다음 근무:</InfoLabel>
                    <InfoValue>
                        {new Date(
                            nextShiftDateTime
                        ).toLocaleString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </InfoValue>
                </InfoSection>
            )}
        </Container>
    );
};

export default WorkplaceEmployeeItem;

const Container = styled.div`
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    max-width: 300px;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
`;

const Info = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
`;

const IconSection = styled.div`
    display: flex;
    gap: 3px;
    align-items: center;
`;

const StatusBadge = styled.div`
    width: fit-content;
    border-radius: 12px;
    border: 1px solid #d9d9d9;
    padding: 1px 8px;
    color: ${(props) => {
        const status = props.status?.toLowerCase();
        if (
            status?.includes('활성') ||
            status?.includes('active')
        )
            return '#2de283';
        if (
            status?.includes('비활성') ||
            status?.includes('inactive')
        )
            return '#ff6b6b';
        if (
            status?.includes('대기') ||
            status?.includes('pending')
        )
            return '#ffa726';
        return '#2de283';
    }};
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.18);
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
`;

const PositionSection = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 8px;
    padding: 5px 8px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
`;

const PositionEmoji = styled.span`
    font-size: 16px;
`;

const PositionText = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #6c757d;
`;

const InfoSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    padding: 3px 0;
`;

const InfoLabel = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #6c757d;
`;

const InfoValue = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: #111111;
`;
