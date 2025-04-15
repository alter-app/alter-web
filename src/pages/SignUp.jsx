import { Link } from "react-router-dom";
import { useState } from "react";
import AuthButton from "../components/auth/AuthButton";
import AuthInput from "../components/auth/AuthInput";
import GenderSelect from "../components/auth/GenderSelect";
import DateInput from "../components/auth/DateInput";

const SignUp = () => {
    const [agreed, setAgreed] = useState(false);
    const [gender, setGender] = useState("male");
    const [date, setDate] = useState("");

    return (
        <div>
            <AuthInput type="email" placeholder="이메일" />

            <AuthInput
                type="number"
                placeholder="휴대폰 번호"
            />

            <AuthInput type="text" placeholder="닉네임" />

            <GenderSelect
                value={gender}
                onChange={setGender}
            />

            <DateInput
                value={date}
                onChange={setDate}
                placeholder="생년월일"
            />

            <AuthInput type="text" placeholder="지역" />

            <div
                style={{
                    display: "flex",
                }}
            >
                <AuthInput
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) =>
                        setAgreed(e.target.checked)
                    }
                />
                사용자 <Link to="/terms">약관</Link>에
                동의합니다
            </div>

            <AuthButton disabled={!agreed}>
                회원가입 완료
            </AuthButton>
        </div>
    );
};

export default SignUp;
