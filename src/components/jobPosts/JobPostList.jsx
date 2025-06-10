import JobPostItem from './JobPostItem';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import { getPostList } from '../../services/post';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Loader';

const JobPostList = ({
    onSelect,
    scrapMap,
    onScrapChange,
}) => {
    const [posts, setPosts] = useState([]);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getPostList({
                cursorInfo,
            });
            setPosts((prev) => [...prev, ...result.data]);
            setCursorInfo(result.page.cursor);
            setTotalCount(result.page.totalCount);
        } catch (error) {
            console.error('공고 리스트 조회 오류:', error);
        }
    };

    return (
        <Container>
            <SearchBar />
            <Divider />
            <ListArea id='scrollableListArea'>
                <Address>서울 구로구 경인로 445</Address>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchData}
                    hasMore={posts.length < totalCount}
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
                    {posts.map((post) => (
                        <JobPostItem
                            key={post.id}
                            {...post}
                            onClick={() => onSelect(post)}
                            checked={
                                scrapMap[post.id] ??
                                post.scrapped
                            }
                            onScrapChange={(value) =>
                                onScrapChange(
                                    post.id,
                                    value
                                )
                            }
                        />
                    ))}
                </InfiniteScroll>
            </ListArea>
        </Container>
    );
};

export default JobPostList;

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

const Address = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    margin-left: 20px;
`;

const Divider = styled.div`
    width: 100%;
    max-width: 390px;
    height: 1px;
    background: #f6f6f6;
    margin: 25px 0 16px 0;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
