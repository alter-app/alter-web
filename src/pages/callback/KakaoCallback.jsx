import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoCallback() {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    useEffect(() => {
        if (code) {
            const sendCodeToBackend = async () => {
                try {
                    const response = await fetch(
                        "/api/public/users/login",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                provider: "KAKAO",
                                authorizationCode: code,
                            }),
                        }
                    );
                    const data = await response.json();

                    if (response.ok) {
                        navigate("/");
                    } else {
                        switch (data.code) {
                            case "A003": {
                                const allData =
                                    data.data || {};
                                navigate("/phoneauth", {
                                    state: {
                                        ...allData,
                                    },
                                });
                                break;
                            }
                            default:
                                alert(
                                    "알 수 없는 오류가 발생했습니다."
                                );
                                navigate("/error");
                                break;
                        }
                    }
                } catch (error) {
                    console.error(
                        "백엔드로 code 전송 실패:",
                        error
                    );
                    alert("네트워크 오류가 발생했습니다.");
                    navigate("/error");
                }
            };

            sendCodeToBackend();
        }
    }, [code, navigate]);

    return (
        <div>
            <h2>로그인 중입니다...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    );
}
