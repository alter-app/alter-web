import { useState } from 'react';
import { postJobPosting } from '../services/post';
import JobCategory from '../components/jobPosts/jobPosting/JobCategory';
import WorkingDaysCategory from '../components/jobPosts/jobPosting/WorkingDaysCategory';
import PaymentCategory from '../components/jobPosts/jobPosting/PaymentCategory';
import { sortWeekdays } from '../utils/weekUtil';

const JobPosting = () => {
    const [jobCategory, setJobCategory] = useState('');

    const [inputs, setInputs] = useState({
        workspaceId: 6,
        title: '',
        description: '',
        payAmount: '',
        paymentType: 'HOURLY',
        keywords: [2, 4],
        schedules: [
            {
                workingDays: ['MONDAY', 'WEDNESDAY'],
                startTime: '10:00',
                endTime: '22:00',
                positionsNeeded: 3,
                position: 3,
            },
        ],
    });

    // 지급 방법 변경
    const handlePaymentTypeChange = (value) => {
        setInputs((prev) => ({
            ...prev,
            paymentType: value,
        }));
    };

    const handleJobCategoryChange = (value) => {
        setJobCategory(value);
    };

    const handleWorkingDaysChange = (value) => {
        const sortedDays = sortWeekdays(value);
        setInputs((prev) => ({
            ...prev,
            schedules: [
                {
                    ...prev.schedules[0],
                    workingDays: sortedDays,
                },
                // 만약 schedules가 여러 개라면, 나머지도 추가
            ],
        }));
        console.log(sortedDays);
    };

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleJobPosting = async () => {
        try {
            await postJobPosting(inputs);
            console.log(inputs);
        } catch (error) {
            alert(
                error.message || '공고 작성 중 오류 발생'
            );
        }
    };

    return (
        <>
            <input
                name='title'
                placeholder='공고 제목'
                value={inputs.title}
                onChange={handleInputChange}
            />
            <input
                name='description'
                placeholder='설명'
                value={inputs.description}
                onChange={handleInputChange}
            />
            <JobCategory
                onChange={handleJobCategoryChange}
            />
            <PaymentCategory
                onChange={handlePaymentTypeChange}
            />
            <input
                type='number'
                name='payAmount'
                placeholder='급여'
                value={inputs.payAmount}
                onChange={handleInputChange}
            />
            <WorkingDaysCategory
                onChange={handleWorkingDaysChange}
            />
            <button onClick={handleJobPosting}>작성</button>
        </>
    );
};

export default JobPosting;
