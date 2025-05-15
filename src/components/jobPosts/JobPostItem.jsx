import styled from "styled-components";
import clock from "../../assets/icons/clock.svg";
import calendar from "../../assets/icons/calendar.svg";
import BookmarkButton from "./Bookmark";
import { useState } from "react";

const JobPostItem = () => {
    const [checked, setChecked] = useState(false);

    return (
        <InfoContainer>
            <CompanyName>
                상호야! 너 이름적고가!
            </CompanyName>
            <TopRow>
                <Title>
                    글자 수가 많으면 넘어간다~ 글자 수가
                    많으면 넘어간다~ 글자 수가 많으면
                    넘어간다~
                </Title>
                <BookmarkButton
                    checked={checked}
                    onChange={() =>
                        setChecked((prev) => !prev)
                    }
                />
            </TopRow>
            <Description>
                시급 <WageHighlight>10,030</WageHighlight>{" "}
                원 · 업무내용없네용 · 1일 전
            </Description>
            <InfoRow>
                <InfoGroup>
                    <img src={clock} alt="근무 시간" />
                    <InfoText>12:00 ~ 18:00</InfoText>
                </InfoGroup>
                <InfoGroup>
                    <img src={calendar} alt="근무 요일" />
                    <InfoText>월, 수, 토, 일</InfoText>
                </InfoGroup>
            </InfoRow>
        </InfoContainer>
    );
};

export default JobPostItem;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 390px;
    padding: 16px 20px;
    box-sizing: border-box;
    gap: 5px;
    border-bottom: 1px solid #f6f6f6;
`;

const Title = styled.div`
    width: 300px;
    color: #111111;
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    box-sizing: border-box; /* 패딩/보더 포함한 크기 계산 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    white-space: nowrap; /* 줄바꿈 없이 한 줄로 표시 */
    text-overflow: ellipsis; /* 넘치면 ...으로 표시 */
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 25px;
`;

const CompanyName = styled.div`
    color: #767676;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const Description = styled.div`
    color: #767676;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const WageHighlight = styled.span`
    color: #399982;
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const InfoGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const InfoText = styled.div`
    color: #767676;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    text-align: center;
`;
