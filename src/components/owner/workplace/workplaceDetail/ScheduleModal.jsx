import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { createSchedule } from '../../../../services/schedule';
import { autoInsertColon } from '../../../../utils/timeUtil';
import ConfirmModal from '../../../shared/ConfirmModal';

const ScheduleModal = ({
    isOpen,
    onClose,
    selectedDate,
    selectedDay,
    schedules = [],
    workplaceId,
    currentYear,
    currentMonth,
    onScheduleCreated,
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [position, setPosition] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] =
        useState(false);

    // 모달이 열릴 때마다 폼 상태 초기화
    useEffect(() => {
        if (isOpen) {
            setShowAddForm(false);
            setStartTime('');
            setEndTime('');
            setPosition('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleClose = () => {
        setShowAddForm(false);
        setStartTime('');
        setEndTime('');
        setPosition('');
        onClose();
    };

    const handleAddScheduleClick = () => {
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setStartTime('');
        setEndTime('');
        setPosition('');
    };

    const handleStartTimeChange = (e) => {
        const formatted = autoInsertColon(e.target.value);
        setStartTime(formatted);
    };

    const handleEndTimeChange = (e) => {
        const formatted = autoInsertColon(e.target.value);
        setEndTime(formatted);
    };

    const handleSubmitClick = () => {
        if (!startTime || !endTime || !position) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (!workplaceId) {
            alert('업장 ID가 없습니다.');
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmModal(false);

        try {
            setIsSubmitting(true);

            // 시간 형식 검증 및 파싱
            const parseTime = (timeStr) => {
                if (!timeStr || !timeStr.includes(':')) {
                    throw new Error(
                        '시간 형식이 올바르지 않습니다.'
                    );
                }
                const parts = timeStr.split(':');
                const hour = parseInt(parts[0], 10);
                const minute = parseInt(
                    parts[1] || '0',
                    10
                );

                if (isNaN(hour) || isNaN(minute)) {
                    throw new Error(
                        '시간 형식이 올바르지 않습니다.'
                    );
                }
                if (
                    hour < 0 ||
                    hour > 23 ||
                    minute < 0 ||
                    minute > 59
                ) {
                    throw new Error(
                        '시간 범위가 올바르지 않습니다.'
                    );
                }

                return { hour, minute };
            };

            const startTimeParsed = parseTime(startTime);
            const endTimeParsed = parseTime(endTime);

            // 선택된 날짜로 startDateTime과 endDateTime 생성
            const date = new Date(
                currentYear,
                currentMonth - 1,
                selectedDate
            );

            const startDateTime = new Date(date);
            startDateTime.setHours(
                startTimeParsed.hour,
                startTimeParsed.minute,
                0,
                0
            );

            const endDateTime = new Date(date);
            endDateTime.setHours(
                endTimeParsed.hour,
                endTimeParsed.minute,
                0,
                0
            );

            // ISO 8601 형식으로 변환 (로컬 시간대 유지)
            const formatDateTime = (date) => {
                const year = date.getFullYear();
                const month = String(
                    date.getMonth() + 1
                ).padStart(2, '0');
                const day = String(date.getDate()).padStart(
                    2,
                    '0'
                );
                const hours = String(
                    date.getHours()
                ).padStart(2, '0');
                const minutes = String(
                    date.getMinutes()
                ).padStart(2, '0');
                const seconds = String(
                    date.getSeconds()
                ).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const startDateTimeStr =
                formatDateTime(startDateTime);
            const endDateTimeStr =
                formatDateTime(endDateTime);

            // 디버깅을 위한 로그
            console.log('스케줄 생성 요청 데이터:', {
                workspaceId: parseInt(workplaceId),
                입력한시간: { startTime, endTime },
                position,
                startDateTime: startDateTimeStr,
                endDateTime: endDateTimeStr,
                localStartTime:
                    startDateTime.toLocaleString('ko-KR'),
                localEndTime:
                    endDateTime.toLocaleString('ko-KR'),
            });

            await createSchedule({
                workspaceId: parseInt(workplaceId),
                startDateTime: startDateTimeStr,
                endDateTime: endDateTimeStr,
                position,
            });

            setShowAddForm(false);
            setStartTime('');
            setEndTime('');
            setPosition('');

            // 스케줄 목록 새로고침
            if (onScheduleCreated) {
                onScheduleCreated();
            }

            // 모달 닫기
            handleClose();
        } catch (error) {
            alert(
                error.message ||
                    '스케줄 생성 중 오류가 발생했습니다.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalOverlay onClick={handleBackdropClick}>
            <ModalContainer>
                <ModalHeader>
                    <Title>
                        {selectedDate}일 ({selectedDay})
                        스케줄
                    </Title>
                    <CloseButton onClick={handleClose}>
                        <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M18 6L6 18M6 6L18 18'
                                stroke='#666666'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    {showAddForm ? (
                        <AddScheduleForm>
                            <FormTitle>
                                스케줄 추가
                            </FormTitle>
                            <FormField>
                                <FormLabel>
                                    시작시간
                                </FormLabel>
                                <TimeInput
                                    type='text'
                                    placeholder='09:00'
                                    value={startTime}
                                    onChange={
                                        handleStartTimeChange
                                    }
                                    maxLength={5}
                                />
                            </FormField>
                            <FormField>
                                <FormLabel>
                                    종료시간
                                </FormLabel>
                                <TimeInput
                                    type='text'
                                    placeholder='18:00'
                                    value={endTime}
                                    onChange={
                                        handleEndTimeChange
                                    }
                                    maxLength={5}
                                />
                            </FormField>
                            <FormField>
                                <FormLabel>
                                    포지션
                                </FormLabel>
                                <PositionInput
                                    type='text'
                                    placeholder='예: 바리스타, 설거지'
                                    value={position}
                                    onChange={(e) =>
                                        setPosition(
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>
                            <FormButtonGroup>
                                <CancelFormButton
                                    onClick={
                                        handleCancelAdd
                                    }
                                >
                                    취소
                                </CancelFormButton>
                                <SubmitFormButton
                                    onClick={
                                        handleSubmitClick
                                    }
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? '생성 중...'
                                        : '생성'}
                                </SubmitFormButton>
                            </FormButtonGroup>
                        </AddScheduleForm>
                    ) : (
                        <>
                            {schedules.length === 0 ? (
                                <EmptyMessage>
                                    <EmptyIcon>
                                        🗓️
                                    </EmptyIcon>
                                    <EmptyText>
                                        이 날에는 스케줄이
                                        없습니다.
                                    </EmptyText>
                                </EmptyMessage>
                            ) : (
                                <ScheduleList>
                                    {schedules.map(
                                        (
                                            schedule,
                                            index
                                        ) => (
                                            <ScheduleItem
                                                key={index}
                                            >
                                                <WorkerInfo>
                                                    <WorkerName>
                                                        {schedule
                                                            .assignedWorker
                                                            ?.workerName ||
                                                            '미배정'}
                                                    </WorkerName>
                                                    <Position>
                                                        {schedule.position ||
                                                            '직원'}
                                                    </Position>
                                                </WorkerInfo>
                                                <TimeInfo>
                                                    <TimeRange>
                                                        {schedule.startDateTime &&
                                                            new Date(
                                                                schedule.startDateTime
                                                            ).toLocaleTimeString(
                                                                'ko-KR',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }
                                                            )}
                                                        {schedule.endDateTime &&
                                                            ` - ${new Date(
                                                                schedule.endDateTime
                                                            ).toLocaleTimeString(
                                                                'ko-KR',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }
                                                            )}`}
                                                    </TimeRange>
                                                </TimeInfo>
                                            </ScheduleItem>
                                        )
                                    )}
                                </ScheduleList>
                            )}
                            <AddScheduleButton
                                onClick={
                                    handleAddScheduleClick
                                }
                            >
                                <PlusIcon
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                >
                                    <path
                                        d='M12 5V19M5 12H19'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </PlusIcon>
                                스케줄 추가
                            </AddScheduleButton>
                        </>
                    )}
                </ModalContent>
            </ModalContainer>
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                title='스케줄 생성'
                message='스케줄을 생성하시겠습니까?'
                confirmText='생성'
                cancelText='취소'
                confirmColor='#1976d2'
            />
        </ModalOverlay>
    );
};

export default ScheduleModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
`;

const ModalContainer = styled.div`
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background: #f8f9fa;
`;

const Title = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s ease;

    &:hover {
        background: #e0e0e0;
    }
`;

const ModalContent = styled.div`
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
`;

const EmptyMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
`;

const EmptyIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
`;

const EmptyText = styled.p`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #666666;
    margin: 0;
`;

const ScheduleList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ScheduleItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    border-left: 4px solid #1976d2;
`;

const WorkerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const WorkerName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const Position = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const TimeInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
`;

const TimeRange = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #1976d2;
`;

const Status = styled.div`
    padding: 4px 8px;
    border-radius: 6px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    background: ${(props) => {
        if (props.status === 'CONFIRMED') return '#e8f5e8';
        if (props.status === 'PLANNED') return '#fff3e0';
        return '#f0f0f0';
    }};
    color: ${(props) => {
        if (props.status === 'CONFIRMED') return '#2e7d32';
        if (props.status === 'PLANNED') return '#e65100';
        return '#666666';
    }};
`;

const AddScheduleButton = styled.button`
    width: 100%;
    height: 48px;
    background: #1976d2;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    transition: background-color 0.2s ease;

    &:hover {
        background: #1565c0;
    }

    &:active {
        background: #0d47a1;
    }
`;

const PlusIcon = styled.svg`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AddScheduleForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const FormTitle = styled.h4`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0 0 8px 0;
`;

const FormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const FormLabel = styled.label`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const TimeInput = styled.input`
    width: 100%;
    height: 48px;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: #1976d2;
    }

    &::placeholder {
        color: #999999;
    }
`;

const PositionInput = styled.input`
    width: 100%;
    height: 48px;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: #1976d2;
    }

    &::placeholder {
        color: #999999;
    }
`;

const FormButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 8px;
`;

const CancelFormButton = styled.button`
    flex: 1;
    height: 48px;
    border: 1px solid #e0e0e0;
    background: #ffffff;
    color: #666666;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f8f9fa;
        border-color: #d0d0d0;
    }
`;

const SubmitFormButton = styled.button`
    flex: 1;
    height: 48px;
    border: none;
    background: ${(props) =>
        props.disabled ? '#cccccc' : '#1976d2'};
    color: #ffffff;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    cursor: ${(props) =>
        props.disabled ? 'not-allowed' : 'pointer'};
    transition: background-color 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.disabled ? '#cccccc' : '#1565c0'};
    }
`;
