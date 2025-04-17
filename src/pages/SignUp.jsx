import { useState } from "react";
import {
    useLocation,
    Link,
    useNavigate,
} from "react-router-dom";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import GenderSelector from "../components/auth/GenderSelector";

const SignUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 단계 관리
    const [step, setStep] = useState(1);

    // 1단계 state
    const [name, setName] = useState(
        location.state?.name || ""
    );
    const [phone, setPhone] = useState(
        location.state?.phone || ""
    );
    const [birth, setBirth] = useState(
        location.state?.birthday || ""
    );
    const [gender, setGender] = useState(
        location.state?.gender === "GENDER_MALE"
            ? "남"
            : location.state?.gender === "GENDER_FEMALE"
            ? "여"
            : ""
    );
    const [signupSessionId] = useState(
        location.state?.signupSessionId || ""
    );

    // 2단계 state
    const [nickname, setNickname] = useState("");
    const [nicknameChecked, setNicknameChecked] =
        useState(false);
    const [agreed, setAgreed] = useState(false);
    const [adAgreed, setAdAgreed] = useState(false);

    // 1단계 완료 조건
    const isStep1Valid = name && gender && phone && birth;

    // 2단계 완료 조건
    const isStep2Valid = nicknameChecked && agreed;

    const getGenderCode = (genderStr) => {
        if (genderStr === "남") return "GENDER_MALE";
        if (genderStr === "여") return "GENDER_FEMALE";
        return "";
    };

    const handleSignUp = async () => {
        try {
            const response = await fetch(
                "/api/public/users/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        contact: phone,
                        birthday: birth,
                        gender: getGenderCode(gender),
                        nickname,
                        signupSessionId,
                    }),
                }
            );

            if (!response.ok) {
                let errorMsg = "회원가입에 실패했습니다.";
                try {
                    const errorData = await response.json();
                    console.log(errorData);
                } catch (e) {
                    // JSON 파싱 실패 시 기본 메시지 사용
                }
                throw new Error(errorMsg);
            }

            alert("회원가입 완료!");
            navigate("/");
        } catch (error) {
            alert(
                error.message ||
                    "회원가입 중 오류가 발생했습니다."
            );
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <h2>회원님의 정보를 알려주세요!</h2>
                    <p>
                        알터가 회원님이 동의해 주신 내용을
                        바탕으로 작성했어요.
                        <br />
                        틀리거나 빈 정보가 있다면
                        알려주시겠어요?
                    </p>
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
                    <AuthInput
                        type="tel"
                        placeholder="010-1234-5678"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
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
                    <p>
                        만약 내용이 없다면 모든 내용을
                        기입해 주세요!
                    </p>
                    <AuthButton
                        disabled={!isStep1Valid}
                        onClick={() => setStep(2)}
                    >
                        다 했어요.
                    </AuthButton>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>이제 마지막이에요!</h2>
                    <p>
                        회원님이 알터에서 불릴 닉네임을
                        알려주세요.
                        <br />
                        그리고 필수 정보 제공에 동의해
                        주시면 완료예요.
                    </p>
                    <div>
                        <AuthInput
                            type="text"
                            width="290px"
                            placeholder="닉네임"
                            value={nickname}
                            onChange={(e) => {
                                setNickname(e.target.value);
                                setNicknameChecked(false);
                            }}
                        />
                        <AuthButton
                            type="button"
                            onClick={() =>
                                setNicknameChecked(true)
                            }
                            disabled={!nickname}
                            $font_size="18px"
                            width="98px"
                        >
                            중복 확인
                        </AuthButton>
                    </div>
                    <p>
                        부정적이거나, 타인을 공격하는
                        메시지의 이름은 쓸 수 없어요!
                    </p>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) =>
                                    setAgreed(
                                        e.target.checked
                                    )
                                }
                            />
                            (필수){" "}
                            <Link to="/terms">
                                이용약관
                            </Link>
                            과 개인정보 보호정책 동의
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={adAgreed}
                                onChange={(e) =>
                                    setAdAgreed(
                                        e.target.checked
                                    )
                                }
                            />
                            (선택) 이메일 및 SMS 광고성 정보
                            수신 동의
                        </label>
                    </div>
                    <AuthButton
                        disabled={!isStep2Valid}
                        onClick={handleSignUp}
                    >
                        가입하기
                    </AuthButton>
                </div>
            )}
        </div>
    );
};

export default SignUp;
