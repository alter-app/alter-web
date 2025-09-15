import AppleSignin from 'react-apple-signin-auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// 1. SVG 컴포넌트 import 예시 (vite-plugin-svgr 필요)
import AppleLogo from '../../assets/apple_login_black.svg';

const AppleLoginButton = () => {
    const navigate = useNavigate();

    return (
        <AppleSignin
            authOptions={{
                clientId: import.meta.env
                    .VITE_OAUTH_CLIENT_ID,
                scope: 'email',
                redirectURI: import.meta.env
                    .VITE_OAUTH_REDIRECT_URI,
                usePopup: true,
            }}
            onSuccess={(response) => {
                const authorizationCode =
                    response.authorization.code;
                console.log(
                    'Authorization Code:',
                    authorizationCode
                );
                navigate('/auth/apple/callback', {
                    state: { authorizationCode },
                });
            }}
            onError={(error) => {
                console.error(error);
            }}
            // 2. render prop으로 커스텀 버튼 렌더링
            render={({ onClick, disabled }) => (
                <StyledAppleButton
                    onClick={onClick}
                    disabled={disabled}
                >
                    <AppleButtonImage
                        src={AppleLogo}
                        alt='애플 로그인'
                    />
                </StyledAppleButton>
            )}
        />
    );
};

export default AppleLoginButton;

const StyledAppleButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: inline-block;
    line-height: 0;
    width: 100%;
    max-width: 400px;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const AppleButtonImage = styled.img`
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;

    @media (max-width: 480px) {
        border-radius: 6px;
    }
`;
