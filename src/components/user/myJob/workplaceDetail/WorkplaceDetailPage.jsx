import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../../shared/PageHeader';
import BottomNavigation from '../../../../layouts/BottomNavigation';
import CurrentEmployeesSection from './CurrentEmployeesSection';
import ScheduleCalendarSection from './ScheduleCalendarSection';
import {
    getWorkplaceEmployees,
    getWorkplaceSchedule,
} from '../../../../services/myJob';

// 스케줄 데이터 변환 함수
const convertScheduleData = (
    scheduleArray,
    year,
    month
) => {
    // 해당 월의 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();

    // 첫 번째 날의 요일 (0=일요일, 1=월요일, ...)
    const firstDayOfWeek = firstDay.getDay();

    const scheduleData = [];
    const dayNames = [
        '일',
        '월',
        '화',
        '수',
        '목',
        '금',
        '토',
    ];

    // 첫 번째 날 이전의 빈 날짜들 추가 (이전 달의 날짜들)
    for (let i = 0; i < firstDayOfWeek; i++) {
        scheduleData.push({
            date: null,
            day: dayNames[i],
            employees: [],
            schedules: [],
            isOtherMonth: true,
        });
    }

    // 해당 월의 모든 날짜 생성
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayName = dayNames[date.getDay()];

        // 해당 날짜의 스케줄 찾기
        const daySchedules = scheduleArray.filter(
            (schedule) => {
                if (!schedule.startDateTime) return false;

                const scheduleDate = new Date(
                    schedule.startDateTime
                );
                const isMatch =
                    scheduleDate.getDate() === day &&
                    scheduleDate.getMonth() === month - 1 &&
                    scheduleDate.getFullYear() === year;

                if (isMatch) {
                    console.log(
                        `날짜 ${day}일에 매칭된 스케줄:`,
                        {
                            scheduleDate:
                                scheduleDate.toISOString(),
                            workerName:
                                schedule.assignedWorker
                                    ?.workerName,
                            position: schedule.position,
                            startDateTime:
                                schedule.startDateTime,
                        }
                    );
                }

                return isMatch;
            }
        );

        console.log(
            `날짜 ${day}일의 스케줄 개수:`,
            daySchedules.length
        );

        // 근무자 이름 추출 (중복 제거)
        const uniqueEmployees = [];
        daySchedules.forEach((schedule) => {
            const workerName =
                schedule.assignedWorker?.workerName ||
                '알 수 없는 직원';
            if (!uniqueEmployees.includes(workerName)) {
                uniqueEmployees.push(workerName);
            }
        });

        scheduleData.push({
            date: day,
            day: dayName,
            employees: uniqueEmployees,
            schedules: daySchedules,
            isOtherMonth: false,
        });
    }

    return scheduleData;
};

const WorkplaceDetailPage = () => {
    const { workplaceId, workplaceName } = useParams();
    const navigate = useNavigate();
    // 업장 정보는 URL 파라미터에서 직접 사용
    const workplace = {
        id: workplaceId,
        name: decodeURIComponent(
            workplaceName || '알 수 없는 업장'
        ),
    };
    const [currentEmployees, setCurrentEmployees] =
        useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllEmployees, setShowAllEmployees] =
        useState(false);

    // 월단위 전환을 위한 상태
    const [currentYear, setCurrentYear] = useState(
        new Date().getFullYear()
    );
    const [currentMonth, setCurrentMonth] = useState(
        new Date().getMonth() + 1
    );

    useEffect(() => {
        const fetchWorkplaceData = async () => {
            try {
                setIsLoading(true);

                // 업장 정보는 URL 파라미터에서 이미 설정됨

                // 현재 근무 중인 직원 목록 조회
                try {
                    console.log(
                        '근무자 목록 조회 시작, workplaceId:',
                        workplaceId
                    );
                    const employeesData =
                        await getWorkplaceEmployees(
                            parseInt(workplaceId),
                            10
                        );
                    console.log(
                        '근무자 목록 API 응답:',
                        employeesData
                    );

                    // API 데이터 구조 확인 및 안전한 배열 접근
                    const employeesArray = Array.isArray(
                        employeesData.data
                    )
                        ? employeesData.data
                        : Array.isArray(employeesData)
                        ? employeesData
                        : [];

                    console.log(
                        '직원 배열:',
                        employeesArray
                    );

                    // API 데이터를 컴포넌트에 맞게 변환
                    const formattedEmployees =
                        employeesArray.map(
                            (employee, index) => {
                                console.log(
                                    `원본 직원 데이터 ${
                                        index + 1
                                    }:`,
                                    employee
                                );

                                const formatted = {
                                    id: employee.id,
                                    name:
                                        employee.user
                                            ?.name ||
                                        '알 수 없는 직원',
                                    position: {
                                        description:
                                            employee
                                                .position
                                                ?.description ||
                                            '직원',
                                        emoji:
                                            employee
                                                .position
                                                ?.emoji ||
                                            '👤',
                                    },
                                    avatar: employee.user
                                        ?.name
                                        ? employee.user.name.charAt(
                                              0
                                          )
                                        : '?',
                                    status: 'working', // 기본값
                                    startTime:
                                        employee.employedAt
                                            ? `입사일: ${new Date(
                                                  employee.employedAt
                                              ).toLocaleDateString(
                                                  'ko-KR'
                                              )}`
                                            : '정보 없음',
                                };

                                console.log(
                                    `변환된 직원 데이터 ${
                                        index + 1
                                    }:`,
                                    formatted
                                );
                                return formatted;
                            }
                        );

                    console.log(
                        '변환된 근무자 목록:',
                        formattedEmployees
                    );
                    console.log(
                        '근무자 수:',
                        formattedEmployees.length
                    );

                    // 각 근무자 데이터 상세 로깅
                    formattedEmployees.forEach(
                        (employee, index) => {
                            console.log(
                                `근무자 ${index + 1}:`,
                                {
                                    id: employee.id,
                                    name: employee.name,
                                    position:
                                        employee.position,
                                    avatar: employee.avatar,
                                    startTime:
                                        employee.startTime,
                                }
                            );
                        }
                    );

                    setCurrentEmployees(formattedEmployees);
                } catch (error) {
                    console.error(
                        '근무자 목록 조회 오류:',
                        error
                    );
                    // 에러 발생 시 빈 배열로 초기화
                    setCurrentEmployees([]);
                }

                // 초기 스케줄 데이터 로딩은 별도 useEffect에서 처리
            } catch (error) {
                console.error(
                    '업장 데이터 로딩 오류:',
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkplaceData();
    }, [workplaceId]);

    // 스케줄 데이터 로딩 함수
    const loadScheduleData = async (year, month) => {
        try {
            console.log('업장 스케줄 조회 시작:', {
                workplaceId,
                year,
                month,
            });

            const scheduleData = await getWorkplaceSchedule(
                parseInt(workplaceId),
                year,
                month
            );
            console.log(
                '업장 스케줄 API 응답:',
                scheduleData
            );

            // 백엔드 데이터 구조에 맞게 스케줄 배열 추출
            let scheduleArray = [];
            if (
                scheduleData &&
                scheduleData.data &&
                Array.isArray(scheduleData.data)
            ) {
                scheduleArray = scheduleData.data;
            }

            console.log(
                '추출된 스케줄 배열:',
                scheduleArray
            );

            // 스케줄 데이터를 컴포넌트에 맞게 변환
            const formattedScheduleData =
                convertScheduleData(
                    scheduleArray,
                    year,
                    month
                );
            console.log(
                '변환된 스케줄 데이터:',
                formattedScheduleData
            );
            setScheduleData(formattedScheduleData);
        } catch (error) {
            console.error('업장 스케줄 조회 오류:', error);
            setScheduleData([]);
        }
    };

    // 이전 월로 이동
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear((prev) => prev - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    // 다음 월로 이동
    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear((prev) => prev + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    // 월 변경 시 스케줄 데이터 다시 로딩
    useEffect(() => {
        if (workplaceId) {
            console.log(
                '월 변경으로 인한 스케줄 데이터 로딩:',
                { currentYear, currentMonth }
            );
            loadScheduleData(currentYear, currentMonth);
        }
    }, [currentYear, currentMonth, workplaceId]);

    const handleBackClick = () => {
        navigate(-1);
    };

    // 전체보기 토글 함수
    const handleToggleShowAll = () => {
        setShowAllEmployees(!showAllEmployees);
    };

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title='로딩 중...'
                    showBackButton={true}
                    onBackClick={handleBackClick}
                />
                <Container>
                    <LoadingMessage>
                        데이터를 불러오는 중...
                    </LoadingMessage>
                </Container>
                <BottomNavigation />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title={workplace.name}
                showBackButton={true}
                onBackClick={handleBackClick}
            />
            <Container>
                <CurrentEmployeesSection
                    employees={currentEmployees}
                    showAllEmployees={showAllEmployees}
                    onToggleShowAll={handleToggleShowAll}
                />
                <ScheduleCalendarSection
                    scheduleData={scheduleData}
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                />
            </Container>
            <BottomNavigation />
        </>
    );
};

export default WorkplaceDetailPage;

const Container = styled.div`
    min-height: calc(100vh - 80px);
    padding: 20px 16px 100px 16px;
    background: #f8f9fa;

    @media (max-width: 480px) {
        padding: 16px 12px 80px 12px;
    }
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #666666;
`;

const WorkplaceInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const LocationInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const LocationIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Address = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
`;

const StatusTag = styled.div`
    padding: 6px 12px;
    background: #4caf50;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: white;
`;
