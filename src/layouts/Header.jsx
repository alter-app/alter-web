import styled from 'styled-components';
import AlterLogo from '../assets/logos/signature CB(좌우).png';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, scope } = useAuthStore();

    const goToHome = () => navigate('/job-lookup-map');
    const goToMyPage = () => navigate('/mypage');
    const goToManager = () => navigate('/manager');
    const goToPosting = () => navigate('/posting');

    return (
        <HeaderWrapper>
            <Logo
                src={AlterLogo}
                alt='알터 로고'
                onClick={goToHome}
                style={{ cursor: 'pointer' }}
            />
            <Description>
                알터에서 시작되는 알바의 변화!
            </Description>

            <NavLinks>
                {isLoggedIn && scope === 'APP' && (
                    <>
                        <NavItem onClick={goToHome}>
                            홈
                        </NavItem>
                        <NavItem onClick={goToMyPage}>
                            마이페이지
                        </NavItem>
                    </>
                )}

                {isLoggedIn && scope === 'MANAGER' && (
                    <>
                        <NavItem onClick={goToManager}>
                            지원자 관리
                        </NavItem>
                        <NavItem onClick={goToPosting}>
                            공고 등록
                        </NavItem>
                    </>
                )}
            </NavLinks>
        </HeaderWrapper>
    );
}

export default Header;

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
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #959595;
`;

const NavLinks = styled.div`
    margin-left: auto;
    display: flex;
    gap: 20px;
    padding-right: 30px;
`;

const NavItem = styled.span`
    font-family: 'Pretendard';
    font-size: 15px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #2de283;
    }
`;
