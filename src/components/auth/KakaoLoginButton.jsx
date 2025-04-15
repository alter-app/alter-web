const KakaoLoginButton = () => {
    const rest_api_key = "79e94c15013247d2fa57d7f094e88e76";
    const redirect_uri =
        "https://kyeongbin-test.netlify.app/oauth/kakao/callback";
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
