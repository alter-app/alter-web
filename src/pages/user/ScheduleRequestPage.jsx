import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../../components/shared/PageHeader';
import AvailableScheduleList from '../../components/user/scheduleRequest/AvailableScheduleList';
import RequestReasonSection from '../../components/user/scheduleRequest/RequestReasonSection';
import RequestTargetSection from '../../components/user/scheduleRequest/RequestTargetSection';
import { createSubstituteRequest } from '../../services/scheduleRequest';

const ScheduleRequestPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const targetWorker = location.state?.targetWorker || {
        id: null,
        name: '알바생',
        workplaceId: null,
        workplaceName: '업장',
    };

    const [selectedSchedule, setSelectedSchedule] =
        useState(null);
    const [requestReason, setRequestReason] = useState('');
    const [currentYear, setCurrentYear] = useState(
        new Date().getFullYear()
    );
    const [currentMonth, setCurrentMonth] = useState(
        new Date().getMonth() + 1
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleReasonChange = (reason) => {
        setRequestReason(reason);
    };

    const handlePreviousMonth = () => {
        const prevMonth =
            currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear =
            currentMonth === 1
                ? currentYear - 1
                : currentYear;
        setCurrentMonth(prevMonth);
        setCurrentYear(prevYear);
    };

    const handleNextMonth = () => {
        const nextMonth =
            currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear =
            currentMonth === 12
                ? currentYear + 1
                : currentYear;
        setCurrentMonth(nextMonth);
        setCurrentYear(nextYear);
    };

    const handleSubmit = async () => {
        if (!selectedSchedule) {
            alert('스케줄을 선택해주세요.');
            return;
        }

        if (!requestReason.trim()) {
            alert('요청 사유를 입력해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);

            const requestData = {
                requestType: 'SPECIFIC',
                targetId: targetWorker.id,
                requestReason: requestReason.trim(),
            };

            await createSubstituteRequest(
                selectedSchedule.id,
                requestData
            );

            alert('대타 요청이 완료되었습니다.');
            navigate(-1); // 이전 페이지로 이동
        } catch (error) {
            console.error('대타 요청 실패:', error);
            alert(
                error.response?.data?.message ||
                    '대타 요청 중 오류가 발생했습니다.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title='대타 요청'
                showBackButton={true}
            />
            <ContentWrapper>
                <RequestTargetSection
                    targetWorker={targetWorker}
                />
                <AvailableScheduleList
                    onScheduleSelect={handleScheduleSelect}
                    selectedSchedule={selectedSchedule}
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                    onPreviousMonth={handlePreviousMonth}
                    onNextMonth={handleNextMonth}
                    workplaceId={targetWorker.workplaceId}
                />
                <RequestReasonSection
                    reason={requestReason}
                    onReasonChange={handleReasonChange}
                />
                <SubmitButton
                    onClick={handleSubmit}
                    $disabled={
                        !selectedSchedule ||
                        !requestReason.trim() ||
                        isSubmitting
                    }
                >
                    {isSubmitting
                        ? '요청 중...'
                        : '요청하기'}
                </SubmitButton>
            </ContentWrapper>
        </PageContainer>
    );
};

export default ScheduleRequestPage;

const PageContainer = styled.div`
    min-height: 100vh;
    background: #f8f9fa;
    padding-top: 60px;
`;

const ContentWrapper = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const SubmitButton = styled.button`
    width: 100%;
    height: 48px;
    background: ${(props) =>
        props.$disabled ? '#e0e0e0' : '#2de283'};
    color: ${(props) =>
        props.$disabled ? '#999999' : '#ffffff'};
    border: none;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    cursor: ${(props) =>
        props.$disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.$disabled ? '#e0e0e0' : '#25c973'};
    }

    &:active {
        background: ${(props) =>
            props.$disabled ? '#e0e0e0' : '#1fb865'};
    }
`;
