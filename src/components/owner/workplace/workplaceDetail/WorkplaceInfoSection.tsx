import styled from 'styled-components';

const WorkplaceInfoSection = ({ workplaceInfo }) => {
    if (!workplaceInfo) {
        return (
            <WorkplaceInfoCard>
                <LoadingMessage>
                    업장 정보를 불러오는 중...
                </LoadingMessage>
            </WorkplaceInfoCard>
        );
    }

    const locationIcon = (
        <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z'
                stroke='#666666'
                strokeWidth='2'
            />
            <circle
                cx='12'
                cy='10'
                r='3'
                stroke='#666666'
                strokeWidth='2'
            />
        </svg>
    );

    const phoneIcon = (
        <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.271 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06671 2.16708 8.43376 2.48353C8.80081 2.79999 9.03996 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9601 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z'
                stroke='#666666'
                strokeWidth='2'
            />
        </svg>
    );

    const businessIcon = (
        <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M3 21H21M5 21V7L12 3L19 7V21M9 9V17M15 9V17'
                stroke='#666666'
                strokeWidth='2'
            />
        </svg>
    );

    return (
        <WorkplaceInfoCard>
            <InfoHeader>
                <InfoTitle>
                    {workplaceInfo.businessName || '업장명'}
                </InfoTitle>
                <BusinessType>
                    {workplaceInfo.businessType || '업종'}
                </BusinessType>
            </InfoHeader>

            <InfoContent>
                <InfoRow>
                    <InfoIcon>{locationIcon}</InfoIcon>
                    <InfoText>
                        {workplaceInfo.fullAddress ||
                            '주소 정보 없음'}
                    </InfoText>
                </InfoRow>

                <InfoRow>
                    <InfoIcon>{phoneIcon}</InfoIcon>
                    <InfoText>
                        {workplaceInfo.contact ||
                            '연락처 정보 없음'}
                    </InfoText>
                </InfoRow>

                <InfoRow>
                    <InfoIcon>{businessIcon}</InfoIcon>
                    <InfoText>
                        사업자등록번호:{' '}
                        {workplaceInfo.businessRegistrationNo ||
                            '정보 없음'}
                    </InfoText>
                </InfoRow>

                {workplaceInfo.description && (
                    <DescriptionRow>
                        <DescriptionText>
                            {workplaceInfo.description}
                        </DescriptionText>
                    </DescriptionRow>
                )}
            </InfoContent>
        </WorkplaceInfoCard>
    );
};

export default WorkplaceInfoSection;

// 업장 정보 섹션 스타일
const WorkplaceInfoCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;
`;

const InfoTitle = styled.h2`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 20px;
    color: #333333;
    margin: 0;
    flex: 1;
`;

const BusinessType = styled.div`
    padding: 6px 12px;
    background: #e8f5e8;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: #2e7d32;
    white-space: nowrap;
`;

const InfoContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
`;

const InfoIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    flex-shrink: 0;
`;

const InfoText = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 1.4;
    flex: 1;
`;

const DescriptionRow = styled.div`
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
`;

const DescriptionText = styled.p`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 1.5;
    margin: 0;
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #666666;
`;
