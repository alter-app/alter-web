import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <Container>
            <MainText>
                알바의 모든 것<br />
                알터에서 쉽고, 믿고, 간편하게
            </MainText>
            <StyledButton
                onClick={() => navigate('/login')}
            >
                알터 시작하기
            </StyledButton>
        </Container>
    );
};

export default Home;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    width: 100vw;
    max-width: 100vw;
    padding: 24px 20px;
    box-sizing: border-box;
    background: #ffffff;
    position: relative;
    overflow-x: hidden;

    @media (max-width: 480px) {
        padding: 20px 16px;
    }

    @media (max-width: 360px) {
        padding: 16px 12px;
    }

    /* iOS Safari safe area */
    @supports (padding: max(0px)) {
        padding-left: max(20px, env(safe-area-inset-left));
        padding-right: max(
            20px,
            env(safe-area-inset-right)
        );
        padding-top: max(24px, env(safe-area-inset-top));
        padding-bottom: max(
            24px,
            env(safe-area-inset-bottom)
        );
    }
`;

const MainText = styled.h1`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    margin-bottom: 40px;
    color: #111111;
    width: 100%;
    max-width: 400px;

    @media (max-width: 480px) {
        font-size: 28px;
        line-height: 36px;
        margin-bottom: 32px;
    }

    @media (max-width: 360px) {
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 28px;
    }
`;

const StyledButton = styled.button`
    width: 100%;
    max-width: 400px;
    height: 56px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 18px;
    font-family: 'Pretendard';
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(45, 226, 131, 0.3);

    &:hover {
        background: #25c973;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(45, 226, 131, 0.4);
    }

    &:active {
        background: #1fb865;
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(45, 226, 131, 0.3);
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 17px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 16px;
        border-radius: 8px;
    }
`;
