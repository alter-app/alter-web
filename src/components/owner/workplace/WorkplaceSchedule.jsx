import user_schedule_icon from '../../../assets/icons/workplace/user_schedule_icon.svg';
import styled from 'styled-components';
import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import multiMonthYear from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';

const WorkplaceSchedule = () => {
    const calendarRef = useRef(null);
    const hiddenInputRef = useRef(null);

    // 날짜 이동
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        if (calendarRef.current) {
            const calendarApi =
                calendarRef.current.getApi();
            calendarApi.gotoDate(selectedDate);
        }
    };

    return (
        <Container>
            <TitleRow>
                <img
                    src={user_schedule_icon}
                    alt='근무자 스케줄'
                />
                <Title>근무자 스케줄</Title>
            </TitleRow>

            <HiddenDateInput
                ref={hiddenInputRef}
                type='date'
                onChange={handleDateChange}
            />

            <CalendarWrapper>
                <FullCalendar
                    plugins={[
                        multiMonthYear,
                        interactionPlugin,
                    ]}
                    initialView='multiMonthYear'
                    multiMonthMaxColumns={1}
                    weekends={true}
                    ref={calendarRef}
                    locale={'ko'}
                    dayMaxEvents={true}
                    headerToolbar={{
                        start: 'datePicker',
                        center: 'title',
                        end: 'prev,next today',
                    }}
                    customButtons={{
                        datePicker: {
                            text: '날짜 선택',
                            click: function () {
                                if (
                                    hiddenInputRef.current
                                ) {
                                    hiddenInputRef.current.showPicker();
                                }
                            },
                        },
                        today: {
                            text: '오늘',
                            click: function () {
                                if (calendarRef.current) {
                                    calendarRef.current
                                        .getApi()
                                        .today();
                                }
                            },
                        },
                    }}
                    events={[
                        {
                            title: '홍길금',
                            start: '2025-08-11T10:00:00',
                            end: '2025-08-11T11:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길은',
                            start: '2025-08-11T11:00:00',
                            end: '2025-08-11T12:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길동',
                            start: '2025-08-11T12:00:00',
                            end: '2025-08-11T13:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길구리',
                            start: '2025-08-11T13:00:00',
                            end: '2025-08-11T14:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길아연',
                            start: '2025-08-11T14:00:00',
                            end: '2025-08-11T15:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길철',
                            start: '2025-08-11T15:00:00',
                            end: '2025-08-11T16:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길탄소',
                            start: '2025-08-11T16:00:00',
                            end: '2025-08-11T17:00:00',
                            color: '#2DE283',
                        },
                        {
                            title: '홍길칼슘',
                            start: '2025-08-11T17:00:00',
                            end: '2025-08-11T18:00:00',
                            color: '#2DE283',
                        },
                    ]}
                />
            </CalendarWrapper>
        </Container>
    );
};

export default WorkplaceSchedule;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
`;

const TitleRow = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
`;

const HiddenDateInput = styled.input`
    display: none;
`;

const CalendarWrapper = styled.div`
    border-radius: 20px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
    padding: 30px;
    background-color: #ffffff;

    .fc-datePicker-button {
        background: #ffffff !important;
        color: #767676 !important;
        border: 1px solid #767676 !important;
        border-radius: 8px !important;
        padding: 8px 16px !important;
        font-family: 'Pretendard', sans-serif !important;
        cursor: pointer !important;
    }

    .fc-datePicker-button:focus {
        box-shadow: none !important;
    }

    .fc-prev-button,
    .fc-next-button,
    .fc-today-button {
        background: #ffffff !important;
        color: #767676 !important;
        border: 1px solid #767676 !important;
        border-radius: 8px !important;
    }

    .fc-prev-button:focus,
    .fc-next-button:focus,
    .fc-today-button:focus {
        box-shadow: none !important;
    }
`;
