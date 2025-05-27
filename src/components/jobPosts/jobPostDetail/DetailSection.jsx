import styled from "styled-components";

const DetailSection = () => {
    return (
        <DetailSectionBox>
            <DetailInfoLabel>상세 내용</DetailInfoLabel>
        </DetailSectionBox>
    );
};

export default DetailSection;

const DetailSectionBox = styled.div`
    width: 390px;
    height: 285px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
`;

const DetailInfoLabel = styled.div`
    color: #999999;
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;
