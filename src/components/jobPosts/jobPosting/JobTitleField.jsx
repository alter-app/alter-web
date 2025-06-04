import styled from 'styled-components';

const JobTitleField = ({
    placeholder,
    title,
    name,
    value,
    onChange,
}) => {
    return (
        <StyledFieldGroup>
            <StyledFieldLabel>{title}</StyledFieldLabel>
            <StyledTextInput
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
        </StyledFieldGroup>
    );
};

export default JobTitleField;

const StyledFieldGroup = styled.div`
    display: flex;
    gap: 26px;
    justify-content: space-between;
`;

const StyledFieldLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111111;
    display: flex;
    align-items: center;
`;

const StyledTextInput = styled.input`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    box-sizing: border-box;
    padding: 13px 16px;
    width: 695px;
    height: 48px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 8px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }
`;
