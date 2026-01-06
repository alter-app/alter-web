import kakaoBtnImage from '../../assets/kakao_login.svg';
import styled from 'styled-components';

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
            <StyledKakaoButton
                onClick={handleLogin}
                aria-label='카카오 로그인'
            >
                <KakaoButtonImage
                    src={kakaoBtnImage}
                    alt='카카오 로그인'
                />
            </StyledKakaoButton>
        </>
    );
};

export default KakaoLoginButton;

const StyledKakaoButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: inline-block;
    line-height: 0;
    width: 100%;
    max-width: 400px;
`;

const KakaoButtonImage = styled.img`
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;

    @media (max-width: 480px) {
        border-radius: 6px;
    }
`;
