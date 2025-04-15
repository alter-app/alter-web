import AppleSignin from "react-apple-signin-auth";
import { useNavigate } from "react-router-dom";

const AppleLoginButton = () => {
    const navigate = useNavigate();

    return (
        <AppleSignin
            authOptions={{
                clientId: "com.test.oauthLogin",
                scope: "email",
                redirectURI:
                    "https://kyeongbin-test.netlify.app",
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
        />
    );
};

export default AppleLoginButton;
