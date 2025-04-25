import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { loginWithProvider } from "../../services/auth";

export default function KakaoCallback() {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (code) {
            loginWithProvider(
                "KAKAO",
                code,
                setAuth,
                navigate
            );
        }
    }, [code, navigate, setAuth]);

    return (
        <div>
            <h2>로그인 중입니다...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    );
}
