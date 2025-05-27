const JobCategory = ({ onChange }) => {
    const JOB_CATEGORIES = [
        { value: 'food_beverage', label: '외식·음료' },
        { value: 'retail_sales', label: '매장관리·판매' },
        { value: 'service', label: '서비스' },
        { value: 'office', label: '사무직' },
        {
            value: 'customer_sales',
            label: '고객상담·리서치·영업',
        },
        {
            value: 'manufacturing_construction',
            label: '생산·건설·노무',
        },
        { value: 'it_technology', label: 'IT·기술' },
        { value: 'design', label: '디자인' },
        { value: 'media', label: '미디어' },
        { value: 'delivery', label: '운전·배달' },
        {
            value: 'medical_research',
            label: '병원·간호·연구',
        },
        { value: 'education', label: '교육·강사' },
    ];

    const handleSelect = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <>
            <select
                name='JobCategory'
                id='JobCategory'
                onChange={handleSelect}
            >
                {JOB_CATEGORIES.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </>
    );
};

export default JobCategory;
