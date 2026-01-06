import styled from 'styled-components';

interface KeywordButtonProps {
    emoji?: string;
    description?: string;
    onClick?: () => void;
    selected?: boolean;
}

const KeywordButton = ({
    emoji,
    description,
    onClick,
    selected,
}: KeywordButtonProps) => {
    return (
        <StyleButton onClick={onClick} selected={selected}>
            <Emoji>{emoji}</Emoji>
            <Description>{description}</Description>
        </StyleButton>
    );
};

export default KeywordButton;

interface StyleButtonProps {
    selected?: boolean;
}

const StyleButton = styled.div<StyleButtonProps>`
    background-color: #f4f4f4;
    background-color: ${({ selected }) =>
        selected ? '#2DE283' : '#f4f4f4'};
    border-radius: 30px;
    padding: 5px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
        padding: 4px 12px;
        gap: 8px;
        border-radius: 25px;
    }

    @media (max-width: 360px) {
        padding: 3px 10px;
        gap: 6px;
        border-radius: 20px;
    }
`;

const Emoji = styled.span`
    font-size: 16px;

    @media (max-width: 480px) {
        font-size: 14px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
    }
`;

const Description = styled.span`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    white-space: nowrap;

    @media (max-width: 480px) {
        font-size: 14px;
        line-height: 20px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 18px;
    }
`;
