import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RouteButton = ({ text, path }) => {
    const navigate = useNavigate();
    const onNavigate = () => navigate(path);
    return (
        <>
            <Button onClick={onNavigate}>{text}</Button>
        </>
    );
};

export default RouteButton;

const Button = styled.div`
    width: 200px;
    height: 60px;
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 17px;
    line-height: 18px;
    border: solid 1px #767676;
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.25);

    &:hover {
    }
`;
