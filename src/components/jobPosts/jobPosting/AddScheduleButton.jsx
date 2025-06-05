import styled from 'styled-components';
import addButton from '../../../assets/icons/addButton.svg';

const AddScheduleButton = ({ onClick }) => {
    return (
        <Container onClick={onClick}>
            <img src={addButton} alt='근무 일정 추가' />
        </Container>
    );
};

export default AddScheduleButton;

const Container = styled.div`
    width: 780px;
    height: 48px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px #d9d9d9;
`;
