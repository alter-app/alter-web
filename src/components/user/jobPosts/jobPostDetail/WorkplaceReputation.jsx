import styled from 'styled-components';

const WorkplaceReputation = ({ workspace }) => {
    const reputationSummary = workspace?.reputationSummary;

    return (
        <ReputationBox>
            <ReputationLabel>AI 평판 요약</ReputationLabel>
            <AIArea>
                <AIBadge>AI</AIBadge>
                <ReputationContent>
                    {reputationSummary?.summaryDescription ||
                        '가게 평판이 없습니다.'}
                </ReputationContent>
            </AIArea>
        </ReputationBox>
    );
};

export default WorkplaceReputation;

const ReputationBox = styled.div`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #ffffff;

    @media (max-width: 480px) {
        padding: 16px;
    }

    @media (max-width: 360px) {
        padding: 14px 12px;
    }
`;

const ReputationLabel = styled.div`
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    @media (max-width: 480px) {
        font-size: 16px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
        line-height: 16px;
    }
`;

const ReputationContent = styled.div`
    white-space: pre-wrap;
    word-break: break-all;
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
`;

const AIArea = styled.div`
    width: 100%;
    padding: 16px;
    background-color: #f0fff7;
    border: 1px solid #2de283;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    margin-top: 16px;
    position: relative;

    @media (max-width: 480px) {
        padding: 14px;
        margin-top: 14px;
    }

    @media (max-width: 360px) {
        padding: 12px;
        margin-top: 12px;
    }
`;

const AIBadge = styled.div`
    position: absolute;
    top: -10px;
    right: 12px;
    background: #2de283;
    font-family: 'Pretendard';
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 6px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 480px) {
        font-size: 11px;
        padding: 2px 5px;
        top: -9px;
        right: 10px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        padding: 1px 4px;
        top: -8px;
        right: 8px;
    }
`;
