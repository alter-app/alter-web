import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { loginWithProvider } from "../../services/auth";

function AppleCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { authorizationCode } = location.state || {};
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (authorizationCode) {
            loginWithProvider(
                "APPLE",
                authorizationCode,
                setAuth,
                navigate
            );
        }
    }, [authorizationCode, navigate, setAuth]);

    return <div>Apple 로그인 진행 중...</div>;
}

export default AppleCallback;
