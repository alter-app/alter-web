import AuthButton from "./AuthButton";

const GenderSelector = ({ value, onChange }) => {
    return (
        <div>
            <AuthButton
                type="button"
                onClick={() => onChange("남")}
                disabled={value === "남"}
            >
                남
            </AuthButton>
            <AuthButton
                type="button"
                onClick={() => onChange("여")}
                disabled={value === "여"}
            >
                여
            </AuthButton>
        </div>
    );
};

export default GenderSelector;
