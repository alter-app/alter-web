import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {
    createSchedule,
    assignWorker,
} from '../../../../services/schedule';
import { autoInsertColon } from '../../../../utils/timeUtil';
import { getWorkplaceEmployee } from '../../../../services/workplaceService';
import ConfirmModal from '../../../shared/ConfirmModal';
import ScheduleItem from './ScheduleItem';

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
    const [showAssignModal, setShowAssignModal] =
        useState(false);
    const [selectedSchedule, setSelectedSchedule] =
        useState(null);
    const [workers, setWorkers] = useState([]);
    const [selectedWorkerId, setSelectedWorkerId] =
        useState(null);
    const [isLoadingWorkers, setIsLoadingWorkers] =
        useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [
        showAssignConfirmModal,
        setShowAssignConfirmModal,
    ] = useState(false);

    // 모달이 열릴 때마다 폼 상태 초기화
    useEffect(() => {
        if (isOpen) {
            setShowAddForm(false);
            setStartTime('');
            setEndTime('');
            setPosition('');
            setShowAssignModal(false);
            setSelectedSchedule(null);
            setSelectedWorkerId(null);
        }
    }, [isOpen]);

    // 근무자 목록 조회
    useEffect(() => {
        const fetchWorkers = async () => {
            if (showAssignModal && workplaceId) {
                setIsLoadingWorkers(true);
                try {
                    const response =
                        await getWorkplaceEmployee(
                            parseInt(workplaceId)
                        );

                    console.log(
                        '근무자 목록 API 응답:',
                        response
                    );
                    console.log(
                        '응답 타입:',
                        typeof response
                    );
                    console.log(
                        '응답 키:',
                        response
                            ? Object.keys(response)
                            : 'null'
                    );

                    // API 응답 구조에 따라 데이터 추출
                    // 다양한 응답 구조 대응: { data: [...] }, { data: { data: [...] } }, 또는 직접 배열
                    let workersData = [];

                    if (Array.isArray(response)) {
                        workersData = response;
                    } else if (response?.data) {
                        if (Array.isArray(response.data)) {
                            workersData = response.data;
                        } else if (
                            response.data?.data &&
                            Array.isArray(
                                response.data.data
                            )
                        ) {
                            workersData =
                                response.data.data;
                        } else if (
                            response.data?.content &&
                            Array.isArray(
                                response.data.content
                            )
                        ) {
                            workersData =
                                response.data.content;
                        }
                    } else if (
                        response?.content &&
                        Array.isArray(response.content)
                    ) {
                        workersData = response.content;
                    }

                    console.log(
                        '추출된 근무자 데이터:',
                        workersData
                    );
                    console.log(
                        '근무자 수:',
                        workersData.length
                    );

                    setWorkers(workersData);
                } catch (error) {
                    console.error(
                        '근무자 목록 조회 오류:',
                        error
                    );
                    setWorkers([]);
                } finally {
                    setIsLoadingWorkers(false);
                }
            }
        };

        fetchWorkers();
    }, [showAssignModal, workplaceId]);

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
        setShowAssignModal(false);
        setSelectedSchedule(null);
        setSelectedWorkerId(null);
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

    // 스케줄 클릭 핸들러
    const handleScheduleClick = (schedule) => {
        // 미배정인 경우에만 근무자 배정 모달 열기
        if (!schedule.assignedWorker) {
            setSelectedSchedule(schedule);
            setShowAssignModal(true);
        }
    };

    // 근무자 배정 취소
    const handleCancelAssign = () => {
        setShowAssignModal(false);
        setSelectedSchedule(null);
        setSelectedWorkerId(null);
    };

    // 근무자 배정 버튼 클릭 (확인 모달 열기)
    const handleAssignClick = () => {
        if (!selectedSchedule || !selectedWorkerId) {
            alert('근무자를 선택해주세요.');
            return;
        }
        setShowAssignConfirmModal(true);
    };

    // 근무자 배정 확인 (실제 배정 실행)
    const handleConfirmAssign = async () => {
        setShowAssignConfirmModal(false);

        if (!selectedSchedule || !selectedWorkerId) {
            alert('근무자를 선택해주세요.');
            return;
        }

        try {
            setIsAssigning(true);

            // workShiftId 확인 (shiftId, id, workShiftId 등 가능한 필드 확인)
            const workShiftId =
                selectedSchedule.shiftId ||
                selectedSchedule.id ||
                selectedSchedule.workShiftId;

            if (!workShiftId) {
                throw new Error(
                    '스케줄 ID를 찾을 수 없습니다.'
                );
            }

            await assignWorker({
                workShiftId: parseInt(workShiftId),
                workerId: parseInt(selectedWorkerId),
            });

            // 배정 완료 후 모달 닫기 및 목록 새로고침
            setShowAssignModal(false);
            setSelectedSchedule(null);
            setSelectedWorkerId(null);
            setShowAssignConfirmModal(false);

            // 스케줄 목록 새로고침
            if (onScheduleCreated) {
                onScheduleCreated();
            }

            // 메인 모달 닫기
            handleClose();
        } catch (error) {
            alert(
                error.message ||
                    '근무자 배정 중 오류가 발생했습니다.'
            );
        } finally {
            setIsAssigning(false);
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
                                                schedule={
                                                    schedule
                                                }
                                                onClick={() =>
                                                    handleScheduleClick(
                                                        schedule
                                                    )
                                                }
                                                isClickable={
                                                    !schedule.assignedWorker
                                                }
                                            />
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

            <ConfirmModal
                isOpen={showAssignConfirmModal}
                onClose={() =>
                    setShowAssignConfirmModal(false)
                }
                onConfirm={handleConfirmAssign}
                title='근무자 배정'
                message='선택한 근무자를 배정하시겠습니까?'
                confirmText='배정'
                cancelText='취소'
                confirmColor='#1976d2'
            />

            {/* 근무자 배정 모달 */}
            {showAssignModal && (
                <AssignModalOverlay
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCancelAssign();
                        }
                    }}
                >
                    <AssignModalContainer>
                        <AssignModalHeader>
                            <AssignModalTitle>
                                근무자 배정
                            </AssignModalTitle>
                            <CloseButton
                                onClick={handleCancelAssign}
                            >
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
                        </AssignModalHeader>
                        <AssignModalContent>
                            {isLoadingWorkers ? (
                                <LoadingText>
                                    근무자 목록을 불러오는
                                    중...
                                </LoadingText>
                            ) : workers.length === 0 ? (
                                <EmptyWorkerText>
                                    배정할 수 있는 근무자가
                                    없습니다.
                                </EmptyWorkerText>
                            ) : (
                                <WorkerList>
                                    {workers.map(
                                        (worker, index) => {
                                            console.log(
                                                `근무자 ${index}:`,
                                                worker
                                            );

                                            const workerId =
                                                worker.workerId ||
                                                worker.id ||
                                                worker.user
                                                    ?.id ||
                                                worker.userId;
                                            const workerName =
                                                worker.workerName ||
                                                worker.name ||
                                                worker.user
                                                    ?.name ||
                                                worker.userName ||
                                                '이름 없음';

                                            console.log(
                                                `근무자 ${index} - ID:`,
                                                workerId,
                                                '이름:',
                                                workerName
                                            );

                                            if (!workerId) {
                                                console.warn(
                                                    `근무자 ${index}에 ID가 없습니다:`,
                                                    worker
                                                );
                                                return null;
                                            }

                                            return (
                                                <WorkerItem
                                                    key={
                                                        workerId ||
                                                        index
                                                    }
                                                    onClick={() => {
                                                        console.log(
                                                            '근무자 선택:',
                                                            workerId,
                                                            workerName
                                                        );
                                                        setSelectedWorkerId(
                                                            workerId
                                                        );
                                                    }}
                                                    $isSelected={
                                                        selectedWorkerId ===
                                                        workerId
                                                    }
                                                >
                                                    <WorkerNameText>
                                                        {
                                                            workerName
                                                        }
                                                    </WorkerNameText>
                                                    {selectedWorkerId ===
                                                        workerId && (
                                                        <CheckIcon>
                                                            ✓
                                                        </CheckIcon>
                                                    )}
                                                </WorkerItem>
                                            );
                                        }
                                    )}
                                </WorkerList>
                            )}
                        </AssignModalContent>
                        <AssignModalFooter>
                            <CancelAssignButton
                                onClick={handleCancelAssign}
                            >
                                취소
                            </CancelAssignButton>
                            <ConfirmAssignButton
                                onClick={handleAssignClick}
                                disabled={
                                    !selectedWorkerId ||
                                    isAssigning
                                }
                            >
                                {isAssigning
                                    ? '배정 중...'
                                    : '배정'}
                            </ConfirmAssignButton>
                        </AssignModalFooter>
                    </AssignModalContainer>
                </AssignModalOverlay>
            )}
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

// 근무자 배정 모달 스타일
const AssignModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
`;

const AssignModalContainer = styled.div`
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const AssignModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background: #f8f9fa;
`;

const AssignModalTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const AssignModalContent = styled.div`
    padding: 24px;
    max-height: 50vh;
    overflow-y: auto;
`;

const LoadingText = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    text-align: center;
    padding: 40px 20px;
`;

const EmptyWorkerText = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    text-align: center;
    padding: 40px 20px;
`;

const WorkerList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const WorkerItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: ${(props) =>
        props.$isSelected ? '#e3f2fd' : '#f8f9fa'};
    border: 2px solid
        ${(props) =>
            props.$isSelected ? '#1976d2' : 'transparent'};
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.$isSelected ? '#e3f2fd' : '#f0f0f0'};
    }
`;

const WorkerNameText = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #333333;
`;

const CheckIcon = styled.div`
    font-size: 20px;
    color: #1976d2;
    font-weight: bold;
`;

const AssignModalFooter = styled.div`
    display: flex;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid #f0f0f0;
    background: #f8f9fa;
`;

const CancelAssignButton = styled.button`
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

const ConfirmAssignButton = styled.button`
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
