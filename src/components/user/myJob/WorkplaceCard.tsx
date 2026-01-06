import styled from 'styled-components';

const WorkplaceCard = ({
    workplaceName,
    status,
    position,
    wage,
    nextShift,
    onClick,
}) => {
    return (
        <CardContainer onClick={onClick}>
            <CardContent>
                <WorkplaceName>{workplaceName}</WorkplaceName>
                <NextShift>
                    <ClockIcon />
                    <ShiftText>다음 근무: {nextShift}</ShiftText>
                </NextShift>
            </CardContent>
            <ArrowIcon />
        </CardContainer>
    );
};

export default WorkplaceCard;

const CardContainer = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border: 1px solid #e9ecef;

    &:hover {
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 16px;
    color: #333333;
    margin: 0;
    flex: 1;
`;

const StatusBadge = styled.div`
    padding: 4px 8px;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    background: ${(props) => {
        switch (props.$status) {
            case 'working':
                return '#2de283';
            case 'pending':
                return '#ffa726';
            default:
                return '#666666';
        }
    }};
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const JobInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Position = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const Wage = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #399982;
`;

const NextShift = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ClockIcon = styled.div`
    width: 16px;
    height: 16px;
    background: #399982;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
`;

const ShiftText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #399982;
`;

const ArrowIcon = styled.div`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: #cccccc;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E")
        no-repeat center;

    mask-size: contain;
`;
