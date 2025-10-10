import styled from 'styled-components';

const ReputationCard = ({
    workplaceName,
    reviewerName,
    timeAgo,
    rating,
    isNew = false,
    requesterType = 'UNKNOWN',
    onAccept,
    onReject,
}) => {
    // 요청자 타입에 따른 표시 로직
    const getDisplayInfo = () => {
        if (requesterType === 'USER') {
            // USER인 경우: "요청자 이름이 근무한 업장 이름에서 평판을 요청했습니다"
            return {
                title: `${reviewerName}`,
                subtitle: workplaceName,
                description: `${reviewerName}님이 ${workplaceName}에서 평판을 요청했습니다`,
            };
        } else if (requesterType === 'WORKSPACE') {
            // WORKSPACE인 경우: "업장 이름이 평판을 요청했습니다"
            return {
                title: workplaceName,
                subtitle: '업장에서 평판 요청',
                description: `${workplaceName}에서 평판을 요청했습니다`,
            };
        } else {
            // 기존 로직
            return {
                title: workplaceName,
                subtitle: reviewerName,
                description: `${reviewerName}님이 평판을 요청했습니다`,
            };
        }
    };

    const displayInfo = getDisplayInfo();

    return (
        <CardContainer>
            <CardContent>
                <WorkplaceName>
                    {displayInfo.title}
                </WorkplaceName>
                <ReviewerName>
                    {displayInfo.subtitle}
                </ReviewerName>
                <TimeAgo>{timeAgo}</TimeAgo>
            </CardContent>
            <ButtonContainer>
                <AcceptButton onClick={onAccept}>
                    수락
                </AcceptButton>
                <RejectButton onClick={onReject}>
                    거절
                </RejectButton>
            </ButtonContainer>
        </CardContainer>
    );
};

export default ReputationCard;

const CardContainer = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    margin: 0;
`;

const NewBadge = styled.div`
    width: 20px;
    height: 20px;
    background: #ff4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 10px;
    color: #ffffff;
`;

const ReviewerName = styled.p`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    margin: 0px;
    line-height: 1.4;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TimeAgo = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #999999;
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const StarIcon = styled.div`
    width: 16px;
    height: 16px;
    background: #ffd700;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
`;

const Rating = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #333333;
`;

const NewTag = styled.div`
    width: 16px;
    height: 16px;
    background: #ff4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 8px;
    color: #ffffff;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 16px;
`;

const AcceptButton = styled.button`
    padding: 8px 16px;
    background: #2de283;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;

    &:hover {
        background: #26c973;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const RejectButton = styled.button`
    padding: 8px 16px;
    background: #ff4444;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;

    &:hover {
        background: #e63939;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;
