import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { postingApply } from '../../../services/post';
import { getPostDetail } from '../../../services/post';
import { formatTimeToHHMM } from '../../../utils/timeUtil';
import { formatNumber } from '../../../utils/formatNumber';
import JobPostTitleBox from './jobPostDetail/JobPostTitleBox';
import PageHeader from '../../shared/PageHeader';
import JobApplyWorkInfo from './jobPostDetail/JobApplyWorkInfo';
import DetailSection from './jobPostDetail/DetailSection';
import Divider from './jobPostDetail/Divider';
import {
    WEEKDAYS_KOR,
    WEEKDAYS_KOR_ARRAY,
} from '../../../utils/weekdayUtils';

const MIN_DESCRIPTION_LENGTH = 15;

const JobApplyOverlay = ({
    postId,
    onClose,
    onApplySuccess,
}) => {
    const [description, setDescription] = useState('');
    const [detail, setDetail] = useState(null);
    const [selectedSchedule, setSelectedSchedule] =
        useState(null);
    const [descriptionError, setDescriptionError] =
        useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                if (postId) {
                    const result = await getPostDetail(
                        postId
                    );
                    setDetail(result.data);
                }
            } catch (error) {
                console.error(
                    '공고 상세 조회 오류:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [postId]);

    useEffect(() => {
        if (
            detail?.schedules &&
            detail.schedules.length > 0
        ) {
            setSelectedSchedule(detail.schedules[0].id);
        }
    }, [detail]);

    const handleApply = async () => {
        if (description.trim().length === 0) {
            setDescriptionError('자기소개를 입력해주세요.');
            return;
        }
        if (description.length < MIN_DESCRIPTION_LENGTH) {
            setDescriptionError(
                `${MIN_DESCRIPTION_LENGTH}자 이상 작성해주세요`
            );
            return;
        }

        // 제출 확인 알림
        const isConfirmed =
            window.confirm('정말 제출하시겠습니까?');
        if (!isConfirmed) {
            return;
        }

        try {
            await postingApply({
                postingId: postId,
                postingScheduleId: selectedSchedule,
                description: description,
            });

            // 성공 콜백 호출 (상세 오버레이로 돌아가기)
            if (onApplySuccess) {
                onApplySuccess();
            }
        } catch (error) {
            alert(
                error.message || '공고 지원 중 오류 발생'
            );
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setDescriptionError('');
    };

    const formatPaymentType = (type) => {
        switch (type) {
            case 'HOURLY':
                return '시급';
            case 'DAILY':
                return '일급';
            case 'MONTHLY':
                return '월급';
            default:
                return type;
        }
    };

    if (loading) {
        return (
            <Overlay>
                <Container>
                    <PageHeader
                        title='지원하기'
                        onBack={onClose}
                        variant='sticky'
                    />
                    <Content>
                        <LoadingText>
                            공고 정보를 불러오는 중...
                        </LoadingText>
                    </Content>
                </Container>
            </Overlay>
        );
    }

    if (!detail) {
        return (
            <Overlay>
                <Container>
                    <PageHeader
                        title='지원하기'
                        onBack={onClose}
                        variant='sticky'
                    />
                    <Content>
                        <ErrorText>
                            요청하신 공고를 찾을 수
                            없습니다.
                        </ErrorText>
                    </Content>
                </Container>
            </Overlay>
        );
    }

    return (
        <Overlay>
            <Container>
                <PageHeader
                    title='지원하기'
                    onBack={onClose}
                />

                <Content>
                    {/* 공고 제목 및 워크스페이스 정보 */}
                    <JobPostTitleBox
                        title={detail.title}
                        workspace={detail.workspace}
                        createdAt={detail.createdAt}
                        keywords={detail.keywords || []}
                    />

                    <Divider />

                    {/* 급여 정보 */}
                    <JobApplyWorkInfo
                        paymentType={detail.paymentType}
                        payAmount={detail.payAmount}
                    />

                    <Divider />

                    {/* 상세 내용 */}
                    <DetailSection
                        title='상세 내용'
                        description={
                            detail?.description ||
                            '업무 내용이 없습니다.'
                        }
                    />

                    <Divider />

                    {/* 근무시간 선택 섹션 */}
                    <ScheduleSelectionSection>
                        <SectionTitle>
                            근무시간 선택
                        </SectionTitle>
                        <Gap height={16} />
                        {detail.schedules &&
                            detail.schedules.map(
                                (schedule) => (
                                    <ScheduleSection
                                        key={schedule.id}
                                    >
                                        <ScheduleSelector
                                            schedule={
                                                schedule
                                            }
                                            isSelected={
                                                selectedSchedule ===
                                                schedule.id
                                            }
                                            onClick={() =>
                                                setSelectedSchedule(
                                                    schedule.id
                                                )
                                            }
                                        />
                                        <Gap height={2} />
                                    </ScheduleSection>
                                )
                            )}
                    </ScheduleSelectionSection>

                    <Divider />

                    {/* 자기소개 섹션 */}
                    <SelfIntroSection>
                        <SectionTitle>
                            자기소개
                        </SectionTitle>
                        <Gap height={24} />
                        <SelfIntroTextArea
                            placeholder='본인을 어필할 수 있는 내용(경험, 성격, 목표 등)을 자유롭게 작성해 주세요.'
                            value={description}
                            onChange={
                                handleDescriptionChange
                            }
                            maxLength={200}
                        />
                        {descriptionError && (
                            <ErrorMessage>
                                {descriptionError}
                            </ErrorMessage>
                        )}
                    </SelfIntroSection>
                </Content>

                {/* 하단 버튼 */}
                <BottomButtonContainer>
                    <ApplyButton
                        onClick={handleApply}
                        disabled={selectedSchedule === null}
                    >
                        제출
                    </ApplyButton>
                </BottomButtonContainer>
            </Container>
        </Overlay>
    );
};

// ScheduleSelector 컴포넌트
const ScheduleSelector = ({
    schedule,
    isSelected,
    onClick,
}) => {
    const daysOfWeek = WEEKDAYS_KOR_ARRAY.map(
        (item) => item.label
    );

    return (
        <ScheduleSelectorContainer onClick={onClick}>
            <RadioButton>
                <RadioCircle $isSelected={isSelected} />
            </RadioButton>
            <ScheduleContent>
                <SchedulePosition>
                    <PositionValue>
                        {schedule.position}
                    </PositionValue>
                    <Spacer />
                    <PositionAvailable>
                        {schedule.positionsAvailable}명 모집
                    </PositionAvailable>
                </SchedulePosition>
                <Gap height={12} />
                <ScheduleDays>
                    {daysOfWeek.map((day, index) => {
                        const isActive =
                            schedule.workingDays
                                .map(
                                    (day) =>
                                        WEEKDAYS_KOR[day]
                                )
                                .includes(day);
                        return (
                            <DayText
                                key={day}
                                $day={day}
                                $isActive={isActive}
                                $isLast={
                                    index ===
                                    daysOfWeek.length - 1
                                }
                            >
                                {day}
                            </DayText>
                        );
                    })}
                </ScheduleDays>
                <Gap height={16} />
                <ScheduleTime>
                    <TimeText>
                        {formatTimeToHHMM(
                            schedule.startTime
                        )}{' '}
                        ~{' '}
                        {formatTimeToHHMM(schedule.endTime)}
                    </TimeText>
                    <Gap width={8} />
                    <WorkHoursText>
                        (
                        {calculateWorkHours(
                            schedule.startTime,
                            schedule.endTime
                        )}
                        )
                    </WorkHoursText>
                </ScheduleTime>
            </ScheduleContent>
        </ScheduleSelectorContainer>
    );
};

const calculateWorkHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (diffMinutes === 0) {
        return `${diffHours}시간`;
    }
    return `${diffHours}시간 ${diffMinutes}분`;
};

export default JobApplyOverlay;

// 스타일드 컴포넌트
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
`;

const SectionTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const Gap = styled.div`
    height: ${(props) => props.height || 0}px;
    width: ${(props) => props.width || 0}px;
`;

const ScheduleSelectionSection = styled.div`
    background: #ffffff;
    padding: 20px;
`;

const ScheduleSection = styled.div`
    background: #ffffff;
`;

const ScheduleSelectorContainer = styled.div`
    min-height: 120px;
    background: #ffffff;
    padding: 16px 0 16px 0;
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
`;

const RadioButton = styled.div`
    padding: 0 12px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 0;
`;

const RadioCircle = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: ${(props) =>
        props.$isSelected
            ? '6px solid #2de283'
            : '1px solid #e5e5e5'};
    transition: all 0.1s ease;
`;

const ScheduleContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ScheduleDays = styled.div`
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 4px;
    gap: 2px;
`;

const DayText = styled.div`
    font-family: 'Pretendard';
    font-weight: ${(props) =>
        props.$isActive ? '700' : '500'};
    font-size: 14px;
    background: ${(props) => {
        if (props.$isActive) return '#2de283';
        return '#ffffff';
    }};
    color: ${(props) => {
        if (props.$isActive) return '#ffffff';
        return '#767676';
    }};
    border: 1px solid
        ${(props) => {
            if (props.$isActive) return '#2de283';
            return '#e8e8e8';
        }};
    border-radius: 4px;
    min-width: 32px;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
`;

const ScheduleTime = styled.div`
    display: flex;
    align-items: center;
`;

const TimeText = styled.div`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 14px;
    color: #333333;
`;

const WorkHoursText = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const Spacer = styled.div`
    flex: 1;
`;

const Badge = styled.div`
    padding: 0.5px 5px;
    background: #f5f5f5;
    border-radius: 4px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #767676;
`;

const SelfIntroSection = styled.div`
    background: #ffffff;
    padding: 20px;
`;

const SelfIntroTextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
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

const ErrorMessage = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #ff4444;
    margin-top: 8px;
`;

const BottomButtonContainer = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    background: #ffffff;
    border-top: 1px solid #e0e0e0;
    z-index: 100;

    @supports (padding: max(0px)) {
        padding-bottom: calc(
            16px + max(0px, env(safe-area-inset-bottom))
        );
    }
`;

const ApplyButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    font-family: 'Pretendard';
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.98);
    }
`;

const LoadingText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    color: #666666;
`;

const ErrorText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    color: #666666;
`;

const SchedulePosition = styled.div`
    display: flex;
    align-items: center;
`;

const PositionValue = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const PositionAvailable = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
`;
