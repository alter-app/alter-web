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
        navigate(
            `/owner/workplace/${id}/${encodeURIComponent(
                businessName
            )}`
        );
    };

    return (
        <WorkplaceContainer onClick={goToWorkplaceDetail}>
            <TopSection>
                <WorkplaceName>
                    {businessName}
                </WorkplaceName>
            </TopSection>
            <InfoSection>
                <img src={Location} alt='업장 주소' />
                <AddressRow>
                    <Address>{fullAddress}</Address>
                    <Chevron>{'>'}</Chevron>
                </AddressRow>
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
    gap: 5px;
    padding: 16px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    cursor: pointer;
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

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0;
`;

const TopSection = styled.div`
    display: flex;
    align-items: center;
`;

const InfoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Address = styled.span`
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
`;

const Date = styled.span`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
`;

const AddressRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
`;

const Chevron = styled.span`
    color: #cccccc;
    font-size: 16px;
    line-height: 1;
`;
