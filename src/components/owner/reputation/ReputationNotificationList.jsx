import styled from 'styled-components';
import ReputationNotificationItem from './ReputationNotificationItem';
import { useState, useRef } from 'react';
import Arrow from '../../../assets/icons/Arrow.svg';

const ReputationNotificationList = () => {
    const [reputation, setReputation] = useState([]);
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

    return (
        <>
            <Column>
                <TopBetween>
                    <TopLeftRow>
                        <ReputationTitle>
                            평판 알림
                        </ReputationTitle>
                        <ViewAllButton>
                            전체보기
                        </ViewAllButton>
                    </TopLeftRow>
                    <TopRightRow>
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
                    </TopRightRow>
                </TopBetween>
                <ContentRow>
                    <AccentBar />
                    <ScrollableRow ref={scrollRef}>
                        {reputation.map((item) => (
                            <ReputationNotificationItem
                                key={item.id}
                                {...item}
                            />
                        ))}
                        <ReputationNotificationItem />
                    </ScrollableRow>
                </ContentRow>
            </Column>
        </>
    );
};

export default ReputationNotificationList;

const ReputationTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
`;

const ViewAllButton = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: underline;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const TopBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TopLeftRow = styled.div`
    display: flex;
    gap: 20px;
`;

const TopRightRow = styled.div`
    display: flex;
    gap: 15px;
    padding-right: 20px;
    align-items: center;
`;

const ContentRow = styled.div`
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    gap: 10px;
`;

const AccentBar = styled.div`
    width: 5px;
    height: 30px;
    background: #2de283;
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
