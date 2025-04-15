import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AppleCallBack() {
    const navigate = useNavigate();
    const location = useLocation();
    const { authorizationCode } = location.state || {};

    useEffect(() => {
        if (authorizationCode) {
            fetch(
                `https://ysw123.xyz/api/oauth/login?authorizationCode=${authorizationCode}&provider=APPLE`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then(() => {
                navigate("/");
            });
        } else {
            // 인증 코드가 없을 경우
            console.error("No authorization code received");
            navigate("/apple-login");
        }
    }, [navigate, authorizationCode]);

    return <div>Apple 로그인 진행 중...</div>;
}

export default AppleCallBack;
