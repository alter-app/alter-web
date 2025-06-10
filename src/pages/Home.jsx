import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <StyledButton onClick={() => navigate('/login')}>
            알터 시작하기
        </StyledButton>
    );
};

export default Home;

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
