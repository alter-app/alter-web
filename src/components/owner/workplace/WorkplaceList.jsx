import WorkplaceItem from './workplaceItem';
import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { getWorkplaceList } from '../../../services/mainPageService';

const WorkplaceList = () => {
    const [workplaceData, setWorkplaceData] = useState([]);
    const scrollRef = useRef();

    // 버튼 클릭시 스크롤 이동
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getWorkplaceList();
            setWorkplaceData(result.data);
            console.log(result.data);
        } catch (error) {
            console.error('업장 목록 조회 오류:', error);
        }
    };

    return (
        <>
            <Column>
                <TopBetween>
                    <WorkplaceTitle>
                        업장 목록
                    </WorkplaceTitle>
                    <TopRow>
                        <ArrowBtn onClick={slideLeft}>
                            &lt;
                        </ArrowBtn>
                        <ArrowBtn onClick={slideRight}>
                            &gt;
                        </ArrowBtn>
                    </TopRow>
                </TopBetween>
                <ContentRow>
                    <AccentBar />
                    <ScrollableRow ref={scrollRef}>
                        {workplaceData.map((item) => (
                            <WorkplaceItem
                                key={item.id}
                                {...item}
                            />
                        ))}
                    </ScrollableRow>
                </ContentRow>
            </Column>
        </>
    );
};

export default WorkplaceList;

const WorkplaceTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
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

const AccentBar = styled.div`
    width: 5px;
    height: 30px;
    background: #2de283;
`;

const TopBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TopRow = styled.div`
    display: flex;
    gap: 10px;
    padding-right: 20px;
`;

const ArrowBtn = styled.button`
    background: #fff;
    border: 1px solid #2de283;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 32px;
    color: #2de283;
    cursor: pointer;
    opacity: 0.7;
    &:hover {
        background: #f3fff7;
    }
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
