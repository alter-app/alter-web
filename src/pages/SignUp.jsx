import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignUpStep1 from "../components/auth/SignUpStep1";
import SignUpStep2 from "../components/auth/SignUpStep2";

const SignUp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // 공통 상태 관리
    const [signupSessionId] = useState(
        location.state?.signupSessionId || ""
    );
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
    const [nickname, setNickname] = useState("");
    const [nicknameChecked, setNicknameChecked] =
        useState(false);
    const [agreed, setAgreed] = useState(false);
    const [adAgreed, setAdAgreed] = useState(false);

    // 유효성 검사
    const isStep1Valid = name && gender && phone && birth;
    const isStep2Valid = nicknameChecked && agreed;

    const getGenderCode = (genderStr) => {
        if (genderStr === "남") return "GENDER_MALE";
        if (genderStr === "여") return "GENDER_FEMALE";
        return "";
    };

    const checkNicknameDuplicate = async (nickname) => {
        try {
            const response = await fetch(
                "/api/public/users/exists/nickname",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nickname }),
                }
            );
            const data = await response.json();
            return data.data.duplicated === false;
        } catch (error) {
            alert(
                "닉네임 중복 검사 중 오류가 발생했습니다."
            );
            return false;
        }
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

            if (!response.ok)
                throw new Error("회원가입에 실패했습니다.");
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
                <SignUpStep1
                    {...{
                        name,
                        setName,
                        phone,
                        setPhone,
                        birth,
                        setBirth,
                        gender,
                        setGender,
                    }}
                    isValid={isStep1Valid}
                    onNext={() => setStep(2)}
                />
            )}
            {step === 2 && (
                <SignUpStep2
                    {...{
                        nickname,
                        setNickname,
                        nicknameChecked,
                        setNicknameChecked,
                        agreed,
                        setAgreed,
                        adAgreed,
                        setAdAgreed,
                    }}
                    isValid={isStep2Valid}
                    onPrev={() => setStep(1)}
                    onSubmit={handleSignUp}
                    checkNickname={checkNicknameDuplicate}
                />
            )}
        </div>
    );
};

export default SignUp;
