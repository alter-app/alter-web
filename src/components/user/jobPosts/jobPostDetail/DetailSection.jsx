import styled from 'styled-components';

const DetailSection = ({ description }) => {
    return (
        <DetailSectionBox>
            <DetailInfoLabel>상세 내용</DetailInfoLabel>
            <StyledDescription>
                {description}
            </StyledDescription>
        </DetailSectionBox>
    );
};

export default DetailSection;

const DetailSectionBox = styled.div`
    width: 390px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
`;

const DetailInfoLabel = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
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
`;
