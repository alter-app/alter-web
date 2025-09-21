import styled from 'styled-components';

const KeywordList = ({ workspace }) => {
    const topKeywords =
        workspace?.reputationSummary?.topKeywords || [];

    if (topKeywords.length === 0) {
        return null;
    }

    return (
        <KeywordsBox>
            <KeywordsLabel>핵심 키워드</KeywordsLabel>
            <KeywordsContainer>
                {topKeywords.map((keyword) => (
                    <KeywordItem key={keyword.id}>
                        <KeywordEmoji>
                            {keyword.emoji}
                        </KeywordEmoji>
                        <KeywordText>
                            {keyword.description ||
                                '키워드'}
                        </KeywordText>
                    </KeywordItem>
                ))}
            </KeywordsContainer>
        </KeywordsBox>
    );
};

export default KeywordList;

const KeywordsBox = styled.div`
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

const KeywordsLabel = styled.div`
    color: #333333;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 12px;

    @media (max-width: 480px) {
        font-size: 15px;
        line-height: 18px;
        margin-bottom: 10px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
        line-height: 16px;
        margin-bottom: 8px;
    }
`;

const KeywordsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: 480px) {
        gap: 8px;
    }

    @media (max-width: 360px) {
        gap: 6px;
    }
`;

const KeywordItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 20px;
    background: #f4f4f4;
    border-radius: 40px;
    transition: all 0.2s ease;

    &:hover {
        background: #e9ecef;
    }

    @media (max-width: 480px) {
        padding: 6px 16px;
        gap: 6px;
    }

    @media (max-width: 360px) {
        padding: 5px 12px;
        gap: 4px;
    }
`;

const KeywordEmoji = styled.span`
    font-size: 16px;
    line-height: 1;

    @media (max-width: 480px) {
        font-size: 14px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
    }
`;

const KeywordText = styled.span`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;

    @media (max-width: 480px) {
        font-size: 14px;
        line-height: 24px;
    }

    @media (max-width: 360px) {
        font-size: 13px;
        line-height: 22px;
    }
`;
