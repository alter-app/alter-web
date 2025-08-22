import styled from 'styled-components';
import Location from '../../../assets/icons/workplace/Location.svg';
import Calendar from '../../../assets/icons/workplace/Calendar.svg';
import { formatJoinDate } from '../../../utils/timeUtil';
import { useNavigate } from 'react-router-dom';

const WorkplaceItem = ({
    id,
    businessName,
    fullAddress,
    createdAt,
    status,
}) => {
    const navigate = useNavigate();
    const goToWorkplaceDetail = () => {
        navigate(`/workplace/detail/${id}`);
    };

    return (
        <WorkplaceContainer onClick={goToWorkplaceDetail}>
            <TopSection>
                <WorkplaceName>
                    {businessName}
                </WorkplaceName>
                <StatusBadge>{status}</StatusBadge>
            </TopSection>
            <InfoSection>
                <img src={Location} alt='업장 주소' />
                <Address>{fullAddress}</Address>
            </InfoSection>
            <InfoSection>
                <img src={Calendar} alt='등록일' />
                <Date>{formatJoinDate(createdAt)}</Date>
            </InfoSection>
        </WorkplaceContainer>
    );
};

export default WorkplaceItem;

const WorkplaceContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 10px;
    padding: 20px;
    width: 350px;
    background: #ffffff;
    border-radius: 25px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    cursor: pointer;
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

const Address = styled.div`
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

const InfoSection = styled.div`
    display: flex;
    gap: 3px;
`;

const TopSection = styled.div`
    display: flex;
    justify-content: space-between;
`;
