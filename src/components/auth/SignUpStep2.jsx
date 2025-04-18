import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

const SignUpStep2 = ({
    nickname,
    setNickname,
    setNicknameChecked,
    agreed,
    setAgreed,
    adAgreed,
    setAdAgreed,
    isValid,
    onSubmit,
    checkNickname,
}) => (
    <SBackground>
        <SFormWrapper>
            <InfoTitle>이제 마지막이에요!</InfoTitle>
            <InfoDesc>
                회원님이 알터에서 불릴 닉네임을 알려주세요.
                <br />
                그리고 필수 정보 제공에 동의해 주시면
                완료예요.
            </InfoDesc>

            <Row>
                <AuthInput
                    type="text"
                    width="314px"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => {
                        setNickname(e.target.value);
                        setNicknameChecked(false);
                    }}
                />
                <AuthButton
                    type="button"
                    onClick={async () => {
                        if (!nickname) return;
                        const isAvailable =
                            await checkNickname(nickname);
                        if (isAvailable) {
                            setNicknameChecked(true);
                            alert(
                                "사용 가능한 닉네임입니다!"
                            );
                        } else {
                            setNicknameChecked(false);
                            alert(
                                "이미 사용 중인 닉네임입니다."
                            );
                        }
                    }}
                    disabled={!nickname}
                    $font_size="18px"
                    width="98px"
                >
                    중복 확인
                </AuthButton>
            </Row>

            <InfoGuide>
                부정적이거나, 타인을 공격하는 메시지의
                이름은 쓸 수 없어요!
            </InfoGuide>
            <CheckboxDiv>
                <OptionalLabel>
                    <CustomCheckbox
                        checked={agreed}
                        onChange={(e) =>
                            setAgreed(e.target.checked)
                        }
                    />
                    <RequiredMark>(필수)</RequiredMark>{" "}
                    <PolicyLinkText>
                        <Link to="/terms">이용약관</Link>
                    </PolicyLinkText>
                    과{" "}
                    <PolicyLinkText>
                        <Link to="/terms">
                            {" "}
                            개인정보 보호정책
                        </Link>
                    </PolicyLinkText>
                    동의
                </OptionalLabel>

                <OptionalLabel>
                    <CustomCheckbox
                        checked={adAgreed}
                        onChange={(e) =>
                            setAdAgreed(e.target.checked)
                        }
                    />
                    (선택) 이메일 및 SMS 광고성 정보 수신
                    동의
                </OptionalLabel>
            </CheckboxDiv>

            <AuthButton
                disabled={!isValid}
                onClick={onSubmit}
            >
                가입하기
            </AuthButton>
        </SFormWrapper>
    </SBackground>
);

export default SignUpStep2;

const InfoTitle = styled.span`
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 28px;
    line-height: 38px;
    color: #111111;
`;

const InfoDesc = styled.div`
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;
    margin-top: 24px;
    margin-bottom: 36px;
`;

const InfoGuide = styled.div`
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #767676;
    margin-top: 8px;
    margin-bottom: 196px;
    margin-left: 8px;
`;

const Row = styled.label`
    display: flex;
    gap: 8px;
`;

const OptionalLabel = styled.div`
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #767676;
`;

const RequiredMark = styled.label`
    font-family: "Pretendard";
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #dc0000;
`;

const PolicyLinkText = styled.span`
    font-family: "Pretendard";
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #111111;
`;

const CheckboxDiv = styled.div`
    margin-bottom: 12px;
`;

const CustomCheckbox = styled.input.attrs({
    type: "checkbox",
})`
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: none;
    background: #d9d9d9;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;

    &:checked {
        background: #2de283;
    }
`;

const SBackground = styled.div`
    width: 560px;
    height: 720px;
    max-height: 720px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 4px 4px 12px 2px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const SFormWrapper = styled.div``;
