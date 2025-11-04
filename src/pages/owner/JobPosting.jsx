import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAvailableKeywords,
    postJobPosting,
} from '../../services/post';
import JobTitleField from '../../components/owner/jobPosting/JobTitleField';
import styled from 'styled-components';
import Dropdown from '../../components/Dropdown';
import WorkScheduleItem from '../../components/owner/jobPosting/WorkScheduleItem';
import AddScheduleButton from '../../components/owner/jobPosting/AddScheduleButton';
import WageInputField from '../../components/owner/jobPosting/WageInputField';
import DetailInputField from '../../components/owner/jobPosting/DetailInputField';
import PageHeader from '../../components/shared/PageHeader';

const JobPosting = () => {
    const navigate = useNavigate();

    // 키워드 조회
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        const fetchKeywords = async () => {
            const result = await getAvailableKeywords();
            setKeywords(result.data);
        };
        fetchKeywords();
    }, []);

    // 스케줄, 키워드 등 모든 입력값 상태
    const [inputs, setInputs] = useState({
        workspaceId: 4,
        title: '',
        description: '',
        payAmount: '',
        paymentType: 'HOURLY',
        keywords: [null, null, null],
        schedules: [
            {
                workingDays: [],
                startTime: '',
                endTime: '',
                positionsNeeded: 1,
                position: 1,
            },
        ],
    });

    // 급여 지급 방법 핸들러
    const handlePaymentTypeChange = (newType) => {
        setInputs((prev) => ({
            ...prev,
            paymentType: newType,
        }));
    };

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => {
            if (name === 'payAmount') {
                // 입력값에서 숫자만 추출
                const onlyNumber = value.replace(/\D/g, '');
                // 상태에는 숫자(문자열)를 저장
                return {
                    ...prev,
                    [name]: onlyNumber,
                };
            }
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    // 키워드 선택 핸들러
    const handleKeywordChange =
        (dropdownIndex) => (selectedId) => {
            setInputs((previousInputs) => {
                const updatedKeywords = [
                    ...previousInputs.keywords,
                ];
                updatedKeywords[dropdownIndex] = selectedId;
                return {
                    ...previousInputs,
                    keywords: updatedKeywords,
                };
            });
        };

    // 스케줄 추가
    const handleAddSchedule = () => {
        setInputs((prev) => ({
            ...prev,
            schedules: [
                ...prev.schedules,
                {
                    workingDays: [],
                    startTime: '',
                    endTime: '',
                    positionsNeeded: 1,
                    position: 1,
                },
            ],
        }));
    };

    // 스케줄 삭제
    const handleRemoveSchedule = (scheduleIdx) => {
        setInputs((prev) => ({
            ...prev,
            schedules: prev.schedules.filter(
                (_, idx) => idx !== scheduleIdx
            ),
        }));
    };

    // 스케줄 값 변경 (근무요일, 근무시간 등)
    const handleScheduleChange = (scheduleIdx, changed) => {
        setInputs((prev) => ({
            ...prev,
            schedules: prev.schedules.map((item, idx) =>
                idx === scheduleIdx
                    ? { ...item, ...changed }
                    : item
            ),
        }));
    };

    // 작성 버튼
    const handleJobPosting = async () => {
        try {
            // null, undefined, 0 등 falsy 값 제거
            const filteredInputs = {
                ...inputs,
                keywords: inputs.keywords.filter(Boolean),
            };
            await postJobPosting(filteredInputs);
            navigate('/job-lookup-map');
        } catch (error) {
            alert(
                error.message || '공고 작성 중 오류 발생'
            );
        }
    };

    return (
        <>
            <PageHeader title='공고 작성' />
            <Container>
                <JobTitleAndCompanyFields>
                    <JobTitleField
                        placeholder='공고 제목'
                        title='공고 제목'
                        name='title'
                        value={inputs.title}
                        onChange={handleInputChange}
                    />
                    <Divider />
                    <JobTitleField
                        placeholder='상호명'
                        title='상호명'
                    />
                </JobTitleAndCompanyFields>

                <StyledJobTypeGroup>
                    <JobTypeRow>
                        <SubTitle>업직종</SubTitle>
                        <JobTypeInfo>
                            업직종은 3개까지 선택 가능합니다
                        </JobTypeInfo>
                    </JobTypeRow>
                    <JobTypeRow>
                        {[0, 1, 2].map((idx) => (
                            <Dropdown
                                key={idx}
                                options={keywords}
                                onChange={handleKeywordChange(
                                    idx
                                )}
                            />
                        ))}
                    </JobTypeRow>
                </StyledJobTypeGroup>

                <WorkScheduleGroup>
                    <SubTitle>근무일정</SubTitle>
                    {inputs.schedules.map(
                        (schedule, idx) => (
                            <WorkScheduleItem
                                key={idx}
                                schedule={schedule}
                                index={idx + 1}
                                onChange={(changed) =>
                                    handleScheduleChange(
                                        idx,
                                        changed
                                    )
                                }
                                onRemove={() =>
                                    handleRemoveSchedule(
                                        idx
                                    )
                                }
                            />
                        )
                    )}
                    <AddScheduleButton
                        onClick={handleAddSchedule}
                    />
                </WorkScheduleGroup>

                <WageInputField
                    name='payAmount'
                    value={inputs.payAmount}
                    onChange={handleInputChange}
                    payType={inputs.paymentType}
                    onPayTypeChange={
                        handlePaymentTypeChange
                    }
                />
                <DetailInputField
                    name='description'
                    value={inputs.description}
                    onChange={handleInputChange}
                />
                <StyledButton onClick={handleJobPosting}>
                    작성
                </StyledButton>
            </Container>
        </>
    );
};

export default JobPosting;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    padding-top: 80px;

    @media (max-width: 768px) {
        padding: 0 16px;
        padding-top: 76px;
        gap: 16px;
    }
`;

const JobTitleAndCompanyFields = styled.div`
    width: 100%;
    max-width: 820px;
    min-height: 177px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 24px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 768px) {
        padding: 20px 16px;
        gap: 12px;
        min-height: auto;
    }
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: #f4f4f4;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const StyledJobTypeGroup = styled.div`
    width: 100%;
    max-width: 820px;
    min-height: 152px;
    background-color: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 28px 20px;
    justify-content: space-between;

    @media (max-width: 768px) {
        padding: 20px 16px;
        gap: 16px;
        min-height: auto;
    }
`;

const SubTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111111;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        font-size: 15px;
        line-height: 22px;
    }
`;

const JobTypeInfo = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        font-size: 13px;
        line-height: 18px;
    }
`;

const JobTypeRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
    }
`;

const WorkScheduleGroup = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border: none;
    padding: 20px;
    border-radius: 4px;
    box-sizing: border-box;
    gap: 30px;
    width: 100%;
    max-width: 820px;

    @media (max-width: 768px) {
        padding: 16px;
        gap: 20px;
    }
`;

const StyledButton = styled.button`
    width: 100%;
    max-width: 820px;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        height: 52px;
        font-size: 16px;
        margin-bottom: 16px;
    }
`;
