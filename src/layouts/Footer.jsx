import styled from "styled-components";
import AlterLogo from "../assets/logos/signature B(좌우).png";

const FooterWrapper = styled.footer``;

const FooterLinks = styled.div`
    display: flex;
    justify-content: center;
    gap: 6px;
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    color: #767676;
    font-weight: 400;
    margin-bottom: 14px;
    margin-top: 84px;
`;

const FooterBottom = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 11px;
    font-size: 12px;
    color: #767676;
    font-weight: 400;
`;

const Logo = styled.img`
    height: 15px;
    width: 42px;
    margin-right: 6px;
    vertical-align: middle;
`;

const Bold = styled.span`
    font-weight: 600;
    color: #767676;
`;

const Color = styled.span`
    color: #505050;
`;

function Footer() {
    return (
        <FooterWrapper>
            <FooterLinks>
                <span>이용약관</span>
                <span>|</span>
                <Bold>개인정보처리방침</Bold>
                <span>|</span>
                <span>책임의 한계와 법적 고지</span>
                <span>|</span>
                <span>회원정보 고객센터</span>
            </FooterLinks>
            <FooterBottom>
                <Logo src={AlterLogo} alt="알터 로고" />
                <span>Copyright</span>
                <span>|</span>
                <Color>
                    LOGOR Corp. All Rights Reserved.
                </Color>
            </FooterBottom>
        </FooterWrapper>
    );
}

export default Footer;
