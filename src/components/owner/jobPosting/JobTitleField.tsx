import styled from 'styled-components';

interface JobTitleFieldProps {
    placeholder?: string;
    title: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}

const JobTitleField = ({
    placeholder,
    title,
    name,
    value,
    onChange,
    readOnly = false,
}: JobTitleFieldProps) => {
    return (
        <StyledFieldGroup>
            <StyledFieldLabel>{title}</StyledFieldLabel>
            <StyledTextInput
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
        </StyledFieldGroup>
    );
};

export default JobTitleField;

const StyledFieldGroup = styled.div`
    display: flex;
    gap: 26px;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
    }
`;

const StyledFieldLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111111;
    display: flex;
    align-items: center;
    min-width: 80px;

    @media (max-width: 768px) {
        font-size: 15px;
        line-height: 22px;
        min-width: auto;
    }
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
    flex: 1;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }

    &[readonly] {
        background-color: #f9f9f9;
        cursor: not-allowed;
        color: #666666;
    }

    @media (max-width: 768px) {
        width: 100%;
        height: 48px;
        font-size: 15px;
        padding: 12px 16px;
    }
`;
