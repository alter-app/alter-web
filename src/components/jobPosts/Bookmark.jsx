import styled from 'styled-components';

const BookmarkCheckbox = styled.div`
    display: inline-block;
`;

const CheckboxInput = styled.input`
    display: none;
`;

const CheckboxLabel = styled.label`
    cursor: pointer;
    display: flex;
    align-items: center;
    &:active svg {
        transform: scale(0.8);
        transition: transform 0.3s;
    }
`;

const Icon = styled.svg`
    width: 24px;
    height: 24px;
    fill: ${({ checked }) =>
        checked ? '#2DE283' : 'none'};
    stroke: #333;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: fill 0.2s, transform 0.1s;
`;

const BookmarkButton = ({ checked, onChange, id }) => (
    <BookmarkCheckbox>
        <CheckboxInput
            type='checkbox'
            id={id}
            checked={checked}
            onChange={onChange}
        />
        <CheckboxLabel htmlFor={id}>
            <Icon viewBox='0 0 24 24' checked={checked}>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
            </Icon>
        </CheckboxLabel>
    </BookmarkCheckbox>
);

export default BookmarkButton;
