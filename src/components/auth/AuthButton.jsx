import styled from "styled-components";

const ButtonContainer = styled.div`
    width: ${({ width }) => width || "420px"};
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    box-sizing: border-box;
`;

const StyledButton = styled.button`
    width: 100%;
    height: 100%;
    border: none;
    background: ${({ $background }) =>
        $background || "#2DE283"};
    color: #ffffff;
    font-size: ${({ $fontSize }) => $fontSize || "16px"};
    font-family: "Pretendard";
    font-weight: 400;
    border-radius: ${({ $borderRadius }) =>
        $borderRadius || "8px"};
    cursor: pointer;

    &:disabled {
        background: #cbcbcb;
        cursor: not-allowed;
    }
`;

const AuthButton = ({ width, children, ...props }) => (
    <ButtonContainer width={width}>
        <StyledButton {...props}>{children}</StyledButton>
    </ButtonContainer>
);

export default AuthButton;
