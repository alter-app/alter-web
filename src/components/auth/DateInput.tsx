import { useRef, ChangeEvent } from "react";
import AuthInput from "./AuthInput";

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function DateInput({ value, onChange, placeholder }: DateInputProps) {
    const dateRef = useRef<HTMLInputElement>(null);

    // 버튼 클릭 시 달력 열기
    const handleCalendarClick = () => {
        if (dateRef.current) {
            if ('showPicker' in dateRef.current && typeof dateRef.current.showPicker === 'function') {
                dateRef.current.showPicker();
            } else {
                dateRef.current.click();
            }
        }
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
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
