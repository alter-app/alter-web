import styled from "styled-components";

const InputContainer = styled.div`
    width: ${({ width }) => width || "420px"};
    height: 58px;
    background: #f6f6f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
`;

const StyledInput = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 18px;
    color: #111111;
    outline: none;
    font-family: "Pretendard";
    font-weight: 400;

    &::placeholder {
        color: #999999;
        font-family: "Pretendard";
        font-weight: 400;
    }
`;

const AuthInput = ({ width, ...props }) => (
    <InputContainer width={width}>
        <StyledInput {...props} />
    </InputContainer>
);

export default AuthInput;
