const KakaoLoginButton = () => {
    const rest_api_key = import.meta.env
        .VITE_KAKAO_REST_API_KEY;
    const redirect_uri = import.meta.env
        .VITE_KAKAO_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    const handleLogin = () => {
        window.location.href = kakaoURL;
    };

    return (
        <>
            <button onClick={handleLogin}>
                카카오 로그인
            </button>
        </>
    );
};

export default KakaoLoginButton;
