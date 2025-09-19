import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { postingApply } from '../../services/post';
import { useState, useEffect } from 'react';
import { getPostDetail } from '../../services/post';
import { formatTimeToHHMM } from '../../utils/timeUtil';
import BottomNavigation from '../../layouts/BottomNavigation';

const WEEKDAYS_KOR = {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일',
};
const JobApply = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const postingId = location.state?.id;
    const [description, setDescription] = useState('');
    const [detail, setDetail] = useState(null);
    const [selectedSchedule, setSelectedSchedule] =
        useState(null);

    useEffect(() => {
        getPostDetail(postingId).then((res) =>
            setDetail(res.data)
        );
    }, [postingId]);
    console.log(selectedSchedule);

    useEffect(() => {
        if (
            detail?.schedules &&
            detail.schedules.length > 0
        ) {
            setSelectedSchedule(detail.schedules[0].id);
        }
    }, [detail]);

    const handleApply = async () => {
        try {
            await postingApply({
                postingId: postingId,
                postingScheduleId: selectedSchedule,
                description: description,
            });
            navigate('/job-lookup-map');
        } catch (error) {
            alert(
                error.message || '공고 지원 중 오류 발생'
            );
        }
    };
    return (
        <Column>
            <Title>공고 지원</Title>
            <Container>
                <Row>
                    <SubTitle>상호명</SubTitle>
                    <WorkInfo>
                        {detail?.workspace.name}
                    </WorkInfo>
                </Row>
                <Row>
                    <SubTitle>공고제목</SubTitle>
                    <WorkInfo>{detail?.title}</WorkInfo>
                </Row>
                <Column>
                    <SubTitle>근무시간</SubTitle>
                    {detail?.schedules && (
                        <RadioGroup>
                            {detail.schedules.map((sch) => (
                                <RadioLabel
                                    key={sch.id}
                                    selected={
                                        selectedSchedule ===
                                        sch.id
                                    }
                                >
                                    <RadioInput
                                        type='radio'
                                        name='schedule'
                                        value={sch.id}
                                        checked={
                                            selectedSchedule ===
                                            sch.id
                                        }
                                        onChange={() =>
                                            setSelectedSchedule(
                                                sch.id
                                            )
                                        }
                                    />
                                    <ScheduleText>
                                        <span>
                                            {sch.workingDays
                                                .map(
                                                    (day) =>
                                                        WEEKDAYS_KOR[
                                                            day
                                                        ]
                                                )
                                                .join(', ')}
                                        </span>
                                        <span>
                                            {formatTimeToHHMM(
                                                sch.startTime
                                            )}
                                            ~
                                            {formatTimeToHHMM(
                                                sch.endTime
                                            )}
                                        </span>
                                    </ScheduleText>
                                </RadioLabel>
                            ))}
                        </RadioGroup>
                    )}
                </Column>
                <Column>
                    <SubTitle>자기소개</SubTitle>
                    <DetailTextArea
                        id='detail'
                        placeholder='본인을 어필할 수 있는 내용(경험, 성격, 목표 등)을 자유롭게 작성해 주세요.'
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />
                </Column>
                <StyledButton
                    onClick={handleApply}
                    disabled={selectedSchedule === null}
                >
                    지원
                </StyledButton>
            </Container>
            <BottomNavigation />
        </Column>
    );
};

export default JobApply;

// 스타일드 컴포넌트
const Row = styled.div`
    display: flex;
    align-items: baseline; /* 글자 아랫줄 기준 정렬 */
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 100vh;
    padding-bottom: 80px;

    @media (max-width: 480px) {
        padding-bottom: 70px;
    }

    @media (max-width: 360px) {
        padding-bottom: 60px;
    }
`;
const Container = styled.div`
    width: 820px;
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    box-sizing: border-box;
`;

const SubTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #767676;
    min-width: 90px;
`;

const DetailTextArea = styled.textarea`
    width: 100%;
    height: 300px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    resize: none;
    outline: none;
    padding: 15px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    &:focus {
        border: 1px solid #2de283;
    }
    &::placeholder {
        color: #999999;
    }
`;

const StyledButton = styled.button`
    width: 100%;
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
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const RadioGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    border: 1px solid
        ${({ selected }) =>
            selected ? '#2de283' : '#e5e5e5'};
    border-radius: 4px;
    background: ${({ selected }) =>
        selected ? '#f5fffa' : '#fff'};
    padding: 16px 20px;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
    accent-color: #2de283;
    margin: 0px;
`;

const ScheduleText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: 'Pretendard';
    font-size: 15px;
    color: #222;
    span:first-child {
        font-weight: 600;
    }
    span:last-child {
        color: #767676;
        font-weight: 400;
    }
`;

const Title = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
    color: #111111;
    margin-top: 60px;
`;

const WorkInfo = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #111111;
`;
