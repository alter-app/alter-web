import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirection() {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    useEffect(() => {
        if (code) {
            const sendCodeToBackend = async () => {
                try {
                    // const response = await fetch('백엔드 URL', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({ code: code })
                    // });
                    // const data = await response.json();
                    // if (data.success) {
                    navigate("/");
                    // }
                } catch (error) {
                    console.error(
                        "백엔드로 code 전송 실패:",
                        error
                    );
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
