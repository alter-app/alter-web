import { getWorkplaceEmployee } from '../../../services/workplaceService';
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
            const result = await getWorkplaceEmployee(id);
            setWorkplaceEmployee(result.data);
            console.log(result.data);
        } catch (error) {
            console.error('근무자 조회 오류:', error);
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
