import { useRef } from "react";
import AuthInput from "./AuthInput";

function DateInput({ value, onChange, placeholder }) {
    const dateRef = useRef();

    // 버튼 클릭 시 달력 열기
    const handleCalendarClick = () => {
        if (dateRef.current.showPicker) {
            dateRef.current.showPicker();
        } else {
            dateRef.current.click();
        }
    };

    const handleDateChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <AuthInput
                type="text"
                placeholder={placeholder}
                value={value}
                readOnly
            />
            <button
                type="button"
                onClick={handleCalendarClick}
            >
                달력
            </button>
            <input
                type="date"
                ref={dateRef}
                style={{ display: "none" }}
                onChange={handleDateChange}
            />
        </div>
    );
}

export default DateInput;
