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
    const [managers, setManagers] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const managersScrollRef = useRef();
    const workersScrollRef = useRef();

    useEffect(() => {
        fetchWorkplaceEmployeeList();
    }, []);

    const fetchWorkplaceEmployeeList = async () => {
        if (!id) {
            setError('업장 ID가 필요합니다.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log(
                '매니저 계정 - 근무자 목록 조회 시작, workspaceId:',
                id
            );

            // 점주/매니저와 알바생 목록을 각각 조회
            const [managersData, workersData] =
                await Promise.all([
                    getWorkplaceManagers(id),
                    getWorkplaceWorkers(id),
                ]);

            console.log(
                '매니저 계정 - 점주/매니저 API 응답:',
                managersData
            );
            console.log(
                '매니저 계정 - 알바생 API 응답:',
                workersData
            );

            // 데이터 변환 함수 - API 응답 구조에 맞게 수정
            const transformEmployeeData = (
                employee,
                defaultName,
                defaultPosition,
                defaultEmoji
            ) => ({
                id: employee.id,
                user: {
                    id: employee.user?.id,
                    name:
                        employee.user?.name || defaultName,
                    contact:
                        employee.user?.contact ||
                        '연락처 없음',
                    gender: employee.user?.gender,
                },
                status: {
                    value: employee.status?.value,
                    description:
                        employee.status?.description ||
                        '상태 없음',
                },
                position: {
                    type: employee.position?.type,
                    description:
                        employee.position?.description ||
                        defaultPosition,
                    emoji:
                        employee.position?.emoji ||
                        defaultEmoji,
                },
                createdAt: employee.createdAt,
                employedAt: employee.employedAt,
                resignedAt: employee.resignedAt,
                nextShiftDateTime:
                    employee.nextShiftDateTime,
            });

            // 점주/매니저 데이터 변환 - API 응답 구조에 맞게 수정
            const managersArray = Array.isArray(
                managersData?.data?.data
            )
                ? managersData.data.data
                : Array.isArray(managersData?.data)
                ? managersData.data
                : Array.isArray(managersData)
                ? managersData
                : [];

            // 알바생 데이터 변환 - API 응답 구조에 맞게 수정
            const workersArray = Array.isArray(
                workersData?.data?.data
            )
                ? workersData.data.data
                : Array.isArray(workersData?.data)
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

            // 데이터 변환
            const formattedManagers = managersArray.map(
                (manager) =>
                    transformEmployeeData(
                        manager,
                        '알 수 없는 점주/매니저',
                        '점주/매니저',
                        '👑'
                    )
            );

            const formattedWorkers = workersArray.map(
                (worker) =>
                    transformEmployeeData(
                        worker,
                        '알 수 없는 알바생',
                        '알바생',
                        '👷'
                    )
            );

            console.log(
                '매니저 계정 - 변환된 점주/매니저 목록:',
                formattedManagers
            );
            console.log(
                '매니저 계정 - 변환된 알바생 목록:',
                formattedWorkers
            );
            console.log(
                '매니저 계정 - 점주/매니저 수:',
                formattedManagers.length
            );
            console.log(
                '매니저 계정 - 알바생 수:',
                formattedWorkers.length
            );

            setManagers(formattedManagers);
            setWorkers(formattedWorkers);
        } catch (error) {
            console.error(
                '매니저 계정 - 근무자 조회 오류:',
                error
            );
            setError(
                error.message ||
                    '근무자 목록을 불러오는 중 오류가 발생했습니다.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const slideLeft = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: -400,
                behavior: 'smooth',
            });
        }
    };
    const slideRight = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: 400,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <Column>
                {isLoading ? (
                    <LoadingContainer>
                        <LoadingText>
                            근무자 목록을 불러오는 중...
                        </LoadingText>
                    </LoadingContainer>
                ) : error ? (
                    <ErrorContainer>
                        <ErrorText>{error}</ErrorText>
                        <RetryButton
                            onClick={
                                fetchWorkplaceEmployeeList
                            }
                        >
                            다시 시도
                        </RetryButton>
                    </ErrorContainer>
                ) : (
                    <>
                        {/* 점주/매니저 섹션 */}
                        <SectionContainer>
                            <SectionHeader>
                                <TitleRow>
                                    <img
                                        src={
                                            user_icon_title
                                        }
                                        alt='점주/매니저'
                                    />
                                    <SectionTitle>
                                        점주/매니저
                                    </SectionTitle>
                                </TitleRow>
                                {managers.length > 0 && (
                                    <TopRow>
                                        <ArrowLeftIcon
                                            src={Arrow}
                                            alt='왼쪽 버튼'
                                            onClick={() =>
                                                slideLeft(
                                                    managersScrollRef
                                                )
                                            }
                                        />
                                        <ArrowRightIcon
                                            src={Arrow}
                                            alt='오른쪽 버튼'
                                            onClick={() =>
                                                slideRight(
                                                    managersScrollRef
                                                )
                                            }
                                        />
                                    </TopRow>
                                )}
                            </SectionHeader>
                            <ContentRow>
                                {managers.length === 0 ? (
                                    <EmptyContainer>
                                        <EmptyText>
                                            등록된
                                            점주/매니저가
                                            없습니다.
                                        </EmptyText>
                                    </EmptyContainer>
                                ) : (
                                    <ScrollableRow
                                        ref={
                                            managersScrollRef
                                        }
                                    >
                                        {managers.map(
                                            (item) => (
                                                <WorkplaceEmployeeItem
                                                    key={`manager-${item.id}`}
                                                    status={
                                                        item.status
                                                    }
                                                    user={
                                                        item.user
                                                    }
                                                    position={
                                                        item.position
                                                    }
                                                    employedAt={
                                                        item.employedAt
                                                    }
                                                    nextShiftDateTime={
                                                        item.nextShiftDateTime
                                                    }
                                                />
                                            )
                                        )}
                                    </ScrollableRow>
                                )}
                            </ContentRow>
                        </SectionContainer>

                        {/* 알바생 섹션 */}
                        <SectionContainer>
                            <SectionHeader>
                                <TitleRow>
                                    <img
                                        src={
                                            user_icon_title
                                        }
                                        alt='알바생'
                                    />
                                    <SectionTitle>
                                        알바생
                                    </SectionTitle>
                                </TitleRow>
                                {workers.length > 0 && (
                                    <TopRow>
                                        <ArrowLeftIcon
                                            src={Arrow}
                                            alt='왼쪽 버튼'
                                            onClick={() =>
                                                slideLeft(
                                                    workersScrollRef
                                                )
                                            }
                                        />
                                        <ArrowRightIcon
                                            src={Arrow}
                                            alt='오른쪽 버튼'
                                            onClick={() =>
                                                slideRight(
                                                    workersScrollRef
                                                )
                                            }
                                        />
                                    </TopRow>
                                )}
                            </SectionHeader>
                            <ContentRow>
                                {workers.length === 0 ? (
                                    <EmptyContainer>
                                        <EmptyText>
                                            등록된 알바생이
                                            없습니다.
                                        </EmptyText>
                                    </EmptyContainer>
                                ) : (
                                    <ScrollableRow
                                        ref={
                                            workersScrollRef
                                        }
                                    >
                                        {workers.map(
                                            (item) => (
                                                <WorkplaceEmployeeItem
                                                    key={`worker-${item.id}`}
                                                    status={
                                                        item.status
                                                    }
                                                    user={
                                                        item.user
                                                    }
                                                    position={
                                                        item.position
                                                    }
                                                    employedAt={
                                                        item.employedAt
                                                    }
                                                    nextShiftDateTime={
                                                        item.nextShiftDateTime
                                                    }
                                                />
                                            )
                                        )}
                                    </ScrollableRow>
                                )}
                            </ContentRow>
                        </SectionContainer>
                    </>
                )}
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

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    width: 100%;
`;

const LoadingText = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 40px 20px;
    width: 100%;
`;

const ErrorText = styled.div`
    color: #ff4444;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
`;

const RetryButton = styled.button`
    background-color: #2de283;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #25c973;
    }

    &:active {
        background-color: #1fb865;
    }
`;

const EmptyContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    width: 100%;
`;

const EmptyText = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
`;

const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SectionTitle = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
`;
