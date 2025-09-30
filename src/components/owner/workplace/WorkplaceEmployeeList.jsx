import {
    getWorkplaceManagers,
    getWorkplaceWorkers,
} from '../../../services/workplaceService';
import WorkplaceEmployeeItem from './WorkplaceEmployeeItem';
import { useState, useEffect, useRef } from 'react';
import user_icon_title from '../../../assets/icons/workplace/user_icon_title.svg';
import Arrow from '../../../assets/icons/Arrow.svg';
import styled from 'styled-components';

const WorkplaceEmployeeList = ({ id }) => {
    const [workplaceEmployee, setWorkplaceEmployee] =
        useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        fetchWorkplaceEmployeeList();
    }, []);

    const fetchWorkplaceEmployeeList = async () => {
        try {
            console.log(
                '매니저 계정 - 근무자 목록 조회 시작, workspaceId:',
                id
            );

            // 점주/매니저와 알바생 목록을 각각 조회
            const managersData = await getWorkplaceManagers(
                id
            );
            const workersData = await getWorkplaceWorkers(
                id
            );

            console.log(
                '매니저 계정 - 점주/매니저 API 응답:',
                managersData
            );
            console.log(
                '매니저 계정 - 알바생 API 응답:',
                workersData
            );

            // 점주/매니저 데이터 변환
            const managersArray = Array.isArray(
                managersData.data
            )
                ? managersData.data
                : Array.isArray(managersData)
                ? managersData
                : [];

            // 알바생 데이터 변환
            const workersArray = Array.isArray(
                workersData.data
            )
                ? workersData.data
                : Array.isArray(workersData)
                ? workersData
                : [];

            console.log(
                '매니저 계정 - 점주/매니저 배열:',
                managersArray
            );
            console.log(
                '매니저 계정 - 알바생 배열:',
                workersArray
            );

            // 점주/매니저 데이터를 컴포넌트에 맞게 변환
            const formattedManagers = managersArray.map(
                (manager) => ({
                    id: manager.id,
                    user: {
                        name:
                            manager.user?.name ||
                            '알 수 없는 점주/매니저',
                        contact:
                            manager.user?.contact ||
                            '연락처 없음',
                    },
                    status: {
                        description:
                            manager.status?.description ||
                            '상태 없음',
                    },
                    position: {
                        description:
                            manager.position?.description ||
                            '점주/매니저',
                        emoji:
                            manager.position?.emoji || '👑',
                    },
                    createdAt: manager.createdAt,
                })
            );

            // 알바생 데이터를 컴포넌트에 맞게 변환
            const formattedWorkers = workersArray.map(
                (worker) => ({
                    id: worker.id,
                    user: {
                        name:
                            worker.user?.name ||
                            '알 수 없는 알바생',
                        contact:
                            worker.user?.contact ||
                            '연락처 없음',
                    },
                    status: {
                        description:
                            worker.status?.description ||
                            '상태 없음',
                    },
                    position: {
                        description:
                            worker.position?.description ||
                            '알바생',
                        emoji:
                            worker.position?.emoji || '👷',
                    },
                    employedAt: worker.employedAt,
                    resignedAt: worker.resignedAt,
                    nextShiftDateTime:
                        worker.nextShiftDateTime,
                })
            );

            // 모든 근무자를 합쳐서 정렬 (점주/매니저 먼저, 그 다음 알바생)
            const allEmployees = [
                ...formattedManagers,
                ...formattedWorkers,
            ];

            console.log(
                '매니저 계정 - 변환된 모든 근무자 목록:',
                allEmployees
            );
            console.log(
                '매니저 계정 - 총 근무자 수:',
                allEmployees.length
            );

            setWorkplaceEmployee(allEmployees);
        } catch (error) {
            console.error(
                '매니저 계정 - 근무자 조회 오류:',
                error
            );
        }
    };

    const slideLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -400,
                behavior: 'smooth',
            });
        }
    };
    const slideRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 400,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <Column>
                <TopBetween>
                    <TitleRow>
                        <img
                            src={user_icon_title}
                            alt='근무자 목록'
                        />
                        <Title>근무자 목록</Title>
                    </TitleRow>
                    <TopRow>
                        <ArrowLeftIcon
                            src={Arrow}
                            alt='왼쪽 버튼'
                            onClick={slideLeft}
                        />
                        <ArrowRightIcon
                            src={Arrow}
                            alt='오른쪽 버튼'
                            onClick={slideRight}
                        />
                    </TopRow>
                </TopBetween>
                <ContentRow>
                    <ScrollableRow ref={scrollRef}>
                        {workplaceEmployee.map((item) => (
                            <WorkplaceEmployeeItem
                                key={item.id}
                                status={item.status}
                                user={item.user}
                            />
                        ))}
                    </ScrollableRow>
                </ContentRow>
            </Column>
        </>
    );
};

export default WorkplaceEmployeeList;

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

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ContentRow = styled.div`
    display: flex;
    gap: 10px;
`;

const TopBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TopRow = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
`;

const ArrowRightIcon = styled.img`
    width: 35px;
    height: 35px;
    cursor: pointer;
`;

const ArrowLeftIcon = styled.img`
    width: 35px;
    height: 35px;
    transform: scaleX(-1);
    cursor: pointer;
`;

const ScrollableRow = styled.div`
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    width: 100%;
    min-width: 0;
    padding-left: 10px;
    padding-right: 20px;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;
