import styled from 'styled-components';

const KeywordButton = ({
    emoji,
    description,
    onClick,
    selected,
}) => {
    return (
        <StyleButton onClick={onClick} selected={selected}>
            <Emoji>{emoji}</Emoji>
            <Description>{description}</Description>
        </StyleButton>
    );
};

export default KeywordButton;

const StyleButton = styled.div`
    background-color: #f4f4f4;
    background-color: ${({ selected }) =>
        selected ? '#2DE283' : '#f4f4f4'};
    border-radius: 40px;
    padding: 7px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    cursor: pointer;
`;

const Emoji = styled.span`
    font-size: 16px;
`;

const Description = styled.span`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
`;
