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
    justify-content: center;
    align-items: center;
    /* 배경 이미지는 아래처럼 원하는 이미지를 지정하세요 */
    /* background: url('/your-background.jpg') no-repeat center center/cover; */
`;

const MainText = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 40px;
    color: #222;
    font-family: 'Pretendard', sans-serif;
`;

const StyledButton = styled.button`
    width: 200px;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
`;
