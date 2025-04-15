const GenderSelect = ({ value, onChange }) => {
    return (
        <div className="gender-group">
            <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={value === "male"}
                onChange={() => onChange("male")}
            />
            <label htmlFor="male">남</label>
            <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={value === "female"}
                onChange={() => onChange("female")}
            />
            <label htmlFor="female">여</label>
        </div>
    );
};

export default GenderSelect;
