import styled from 'styled-components';

const DetailSection = ({ title, content, description }) => {
    const displayContent = content || description;
    const displayTitle = title || '상세 내용';

    return (
        <DetailSectionBox>
            <DetailInfoLabel>
                {displayTitle}
            </DetailInfoLabel>
            <StyledDescription>
                {displayContent}
            </StyledDescription>
        </DetailSectionBox>
    );
};

export default DetailSection;

const DetailSectionBox = styled.div`
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

const DetailInfoLabel = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 600;
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

const StyledDescription = styled.div`
    margin-top: 16px;
    white-space: pre-wrap;
    word-break: break-all;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    @media (max-width: 480px) {
        margin-top: 14px;
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        margin-top: 12px;
        font-size: 12px;
        line-height: 16px;
    }
`;
