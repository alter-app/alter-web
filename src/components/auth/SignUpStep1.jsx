import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import GenderSelector from "./GenderSelector";
import styled from "styled-components";
import { formatPhoneNumber } from "../../utils/phoneUtils";

const SignUpStep1 = ({
    name,
    setName,
    phone,
    setPhone,
    birth,
    setBirth,
    gender,
    setGender,
    isValid,
    onNext,
}) => (
    <SBackground>
        <SFormWrapper>
            <InfoTitle>
                회원님의 정보를 알려주세요!
            </InfoTitle>
            <InfoDesc>
                알터가 회원님이 동의해 주신 내용을 바탕으로
                작성했어요.
                <br />
                틀리거나 빈 정보가 있다면 알려주시겠어요?
            </InfoDesc>
            <SInputStack>
                <Row>
                    <AuthInput
                        width="290px"
                        type="text"
                        placeholder="박알바"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <GenderSelector
                        value={gender}
                        onChange={setGender}
                    />
                </Row>
                <AuthInput
                    type="tel"
                    maxLength={13}
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) =>
                        setPhone(
                            formatPhoneNumber(
                                e.target.value
                            )
                        )
                    }
                />

                <AuthInput
                    type="text"
                    placeholder="19450815"
                    value={birth}
                    onChange={(e) =>
                        setBirth(e.target.value)
                    }
                />
            </SInputStack>
            <InfoGuide>
                만약 내용이 없다면 모든 내용을 기입해
                주세요!
            </InfoGuide>

            <AuthButton
                disabled={!isValid}
                onClick={onNext}
            >
                다 했어요.
            </AuthButton>
        </SFormWrapper>
    </SBackground>
);

export default SignUpStep1;

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
    margin-top: 104px;
    margin-bottom: 12px;
`;

const Row = styled.div`
    display: flex;
    gap: 8px;
`;

const SInputStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
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
