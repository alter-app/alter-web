import styled from "styled-components";
import AlterLogo from "../assets/logos/signature CB(좌우).png";

const HeaderWrapper = styled.header`
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0px 1px 4px 1px rgba(31, 40, 35, 0.2);
    display: flex;
    align-items: center;
    gap: 21px;
`;

const Logo = styled.img`
    height: 36px;
    width: 117px;
    width: auto;
    margin-left: 40px;
`;

const Description = styled.span`
    font-family: "Pretendard";
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #959595;
`;

function Header() {
    return (
        <HeaderWrapper>
            <Logo src={AlterLogo} alt="알터 로고" />
            <Description>
                알터에서 시작되는 알바의 변화!
            </Description>
        </HeaderWrapper>
    );
}

export default Header;
