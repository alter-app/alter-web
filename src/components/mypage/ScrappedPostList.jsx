import styled from 'styled-components';
import { getScrapPostList } from '../../services/myPage';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Loader';
import ScrappedPostItem from './ScrappedPostItem';

const ScrappedPostList = () => {
    const [scrappedPosts, setScrappedPosts] = useState([]);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getScrapPostList({
                cursorInfo,
            });
            setScrappedPosts((prev) => [
                ...prev,
                ...result.data,
            ]);
            setCursorInfo(result.page.cursor);
            setTotalCount(result.page.totalCount);
            console.log(result);
        } catch (error) {
            console.error('공고 리스트 조회 오류:', error);
        }
    };

    return (
        <Container>
            <ListArea id='scrollableListArea'>
                <InfiniteScroll
                    dataLength={scrappedPosts.length}
                    next={fetchData}
                    hasMore={
                        scrappedPosts.length < totalCount
                    }
                    loader={
                        <CenteredDiv>
                            <Loader />
                        </CenteredDiv>
                    }
                    endMessage={
                        <CenteredDiv>
                            더 이상 공고가 없습니다.
                        </CenteredDiv>
                    }
                    scrollableTarget='scrollableListArea'
                >
                    {scrappedPosts.map((post) => (
                        <ScrappedPostItem
                            key={post.id}
                            createdAt={post.createdAt}
                            {...post.posting}
                        />
                    ))}
                </InfiniteScroll>
            </ListArea>
        </Container>
    );
};

export default ScrappedPostList;

const Container = styled.div`
    width: 390px;
    height: calc(100vh - 80px); /* 화면 전체 높이 */
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    min-height: 0; /* flexbox에서 overflow 작동 위해 필요 */
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
