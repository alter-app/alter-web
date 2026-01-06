import styled from 'styled-components';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonContainerProps {
    width?: string;
    height?: string;
}

const ButtonContainer = styled.div<ButtonContainerProps>`
    width: ${({ width }) => width || '420px'};
    height: ${({ height }) => height || '58px'};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    box-sizing: border-box;
`;

interface StyledButtonProps {
    $background?: string;
    $fontSize?: string;
    $borderRadius?: string;
}

const StyledButton = styled.button<StyledButtonProps>`
    width: 100%;
    height: 100%;
    border: none;
    background: ${({ $background }) =>
        $background || '#2DE283'};
    color: #ffffff;
    font-size: ${({ $fontSize }) => $fontSize || '16px'};
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: ${({ $borderRadius }) =>
        $borderRadius || '8px'};
    cursor: pointer;

    &:disabled {
        background: #cbcbcb;
        cursor: not-allowed;
    }
`;

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    width?: string;
    height?: string;
    children?: ReactNode;
    $background?: string;
    $fontSize?: string;
    $borderRadius?: string;
}

const AuthButton = ({
    width,
    height,
    children,
    ...props
}: AuthButtonProps) => (
    <ButtonContainer width={width} height={height}>
        <StyledButton {...props}>{children}</StyledButton>
    </ButtonContainer>
);

export default AuthButton;
