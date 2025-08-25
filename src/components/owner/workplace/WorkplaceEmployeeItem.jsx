import user_icon_list from '../../../assets/icons/workplace/user_icon_list.svg';
import phone_icon from '../../../assets/icons/workplace/phone_icon.svg';
import styled from 'styled-components';

const WorkplaceEmployeeItem = ({ status, user }) => {
    return (
        <Container>
            <TopRow>
                <IconSection>
                    <img src={user_icon_list} alt='이름' />
                    <Info>{user.name}</Info>
                </IconSection>
                <StatusBadge>{status}</StatusBadge>
            </TopRow>
            <IconSection>
                <img src={phone_icon} alt='전화번호' />
                <Info>{user.contact}</Info>
            </IconSection>
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
    color: #2de283;
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
