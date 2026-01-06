import styled from 'styled-components';
import addButton from '../../../assets/icons/addButton.svg';

interface AddScheduleButtonProps {
    onClick: () => void;
}

const AddScheduleButton = ({ onClick }: AddScheduleButtonProps) => {
    return (
        <Container onClick={onClick}>
            <img src={addButton} alt='근무 일정 추가' />
        </Container>
    );
};

export default AddScheduleButton;

const Container = styled.div`
    width: 100%;
    max-width: 780px;
    height: 48px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 8px;
    border: solid 1px #d9d9d9;
    touch-action: manipulation;

    @media (max-width: 768px) {
        height: 52px;
    }

    &:active {
        background-color: #f9f9f9;
    }
`;
