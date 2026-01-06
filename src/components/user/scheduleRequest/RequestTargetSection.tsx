import styled from 'styled-components';

const RequestTargetSection = ({ targetWorker }) => {
    const { name = '알바생', workplaceName = '업장' } =
        targetWorker || {};

    return (
        <Section>
            <TargetInfo>
                <TargetIcon>👷</TargetIcon>
                <TargetText>
                    <TargetName>{name}님</TargetName>
                    <TargetWorkplace>
                        {workplaceName}
                    </TargetWorkplace>
                </TargetText>
            </TargetInfo>
            <RequestLabel>에게 대타 요청</RequestLabel>
        </Section>
    );
};

export default RequestTargetSection;

const Section = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const TargetInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const TargetIcon = styled.span`
    font-size: 24px;
`;

const TargetText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const TargetName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const TargetWorkplace = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
`;

const RequestLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 15px;
    color: #399982;
`;
