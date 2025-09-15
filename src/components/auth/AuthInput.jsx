import styled from 'styled-components';

const InputContainer = styled.input`
    width: 100%;
    height: 56px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background-color: #f8f9fa;
    padding: 16px 20px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
        background-color: #ffffff;
        box-shadow: 0 0 0 3px rgba(45, 226, 131, 0.1);
    }

    @media (max-width: 480px) {
        height: 52px;
        font-size: 16px;
        padding: 14px 18px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        height: 48px;
        font-size: 15px;
        padding: 12px 16px;
        border-radius: 8px;
    }
`;

const AuthInput = ({
    width,
    borderColor,
    placeholder,
    type,
    value,
    onChange,
}) => (
    <InputContainer
        width={width}
        $borderColor={borderColor}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
    />
);

export default AuthInput;
