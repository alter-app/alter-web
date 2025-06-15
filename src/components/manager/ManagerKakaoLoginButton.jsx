import kakaoBtnImage from '../../assets/kakao_login_large_wide.png';
import styled from 'styled-components';

const ManagerKakaoLoginButton = () => {
    const rest_api_key = import.meta.env
        .VITE_KAKAO_REST_API_KEY;
    const redirect_uri = import.meta.env
        .VITE_KAKAO_REDIRECT_URI;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&state=managers`;

    const handleLogin = () => {
        window.location.href = kakaoURL;
    };

    return (
        <>
            <StyledKakaoButton
                onClick={handleLogin}
                aria-label='매니저 카카오 로그인'
            >
                <KakaoButtonImage
                    src={kakaoBtnImage}
                    alt='카카오 로그인'
                />
            </StyledKakaoButton>
        </>
    );
};

export default ManagerKakaoLoginButton;

const StyledKakaoButton = styled.button`
    background: none; /* 배경 제거 */
    border: none; /* 테두리 제거 */
    padding: 0; /* 내부 여백 제거 */
    margin: 0; /* 외부 여백 제거 */
    cursor: pointer; /* 클릭 커서 */
    display: inline-block; /* 이미지만큼의 크기 */
    line-height: 0; /* 버튼 자체 높이 최소화 */
`;

const KakaoButtonImage = styled.img`
    width: 420px; /* 이미지 너비 */
    height: 63px; /* 이미지 높이 */
    display: block; /* 이미지 하단 여백 제거 */
`;
