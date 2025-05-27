const PaymentCategory = ({ onChange }) => {
    const PAYMENT_TYPE = [
        { value: 'HOURLY', label: '시급' },
        { value: 'DAILY', label: '일급' },
        { value: 'WEEKLY', label: '주급' },
        { value: 'MONTHLY', label: '월급' },
        { value: 'YEARLY', label: '연봉' },
    ];

    const handleSelect = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <select
            name='PaymentTypeCategory'
            id='PaymentTypeCategory'
            onChange={handleSelect}
        >
            {PAYMENT_TYPE.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default PaymentCategory;
