import AppleSignin from "react-apple-signin-auth";
import { useNavigate } from "react-router-dom";

const AppleLoginButton = () => {
    const navigate = useNavigate();

    return (
        <AppleSignin
            authOptions={{
                clientId: import.meta.env
                    .VITE_OAUTH_CLIENT_ID,
                scope: "email",
                redirectURI: import.meta.env
                    .VITE_OAUTH_REDIRECT_URI,
                usePopup: true,
            }}
            onSuccess={(response) => {
                const authorizationCode =
                    response.authorization.code;
                console.log(
                    "Authorization Code:",
                    authorizationCode
                );
                navigate("/auth/apple/callback", {
                    state: { authorizationCode },
                });
            }}
            onError={(error) => {
                console.error(error);
            }}
            style={{
                minWidth: "420px",
                height: "63px",
                borderRadius: "12px",
                fontSize: "18px",
            }}
            buttonExtraChildren="Apple 로그인"
        />
    );
};

export default AppleLoginButton;
