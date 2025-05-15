import styled from "styled-components";
import dropdown from "../../../assets/icons/dropdown.svg";

const WorkLocation = () => {
    return (
        <WorkLocationBox>
            <WorkLocationLabel>근무 위치</WorkLocationLabel>
            <WorkLocationRow>
                <WorkLocationAddress>
                    경기 무슨시 무슨구 무슨동 무슨로00번길
                    00 글자수 최대로
                </WorkLocationAddress>
                <img
                    src={dropdown}
                    alt="주소"
                    width={20}
                    height={20}
                />
            </WorkLocationRow>
            <WorkLocationRow>
                <SubwayLineChip>1</SubwayLineChip>
                <SubwayLineChip>수인분당선</SubwayLineChip>
                <SubwayStationText>
                    무슨역 몇번 출구
                </SubwayStationText>
            </WorkLocationRow>
        </WorkLocationBox>
    );
};

export default WorkLocation;

const WorkLocationBox = styled.div`
    width: 390px;
    height: 132px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px 20px;
    box-sizing: border-box;
    background-color: #ffffff;
`;

const WorkLocationLabel = styled.div`
    color: #999999;
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;

const WorkLocationAddress = styled.div`
    width: 324px;
    color: #111111;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const WorkLocationRow = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
`;

const SubwayLineChip = styled.div`
    display: inline-block;
    padding: 2px 8px;
    background-color: #f1cf69;
    border-radius: 12px;
    color: #f4f4f4;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
`;

const SubwayStationText = styled.div`
    color: #767676;
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
`;
