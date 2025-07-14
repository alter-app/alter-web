import styled from 'styled-components';
import { getPostingsApplications } from '../../services/managerPage';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../Loader';
import PostingsApplicationsItem from './PostingsApplicationsItem';

const PostingsApplicationsList = () => {
    const [postingsApplications, setPostingsApplications] =
        useState([]);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getPostingsApplications({
                cursorInfo,
            });
            console.log(result.data);

            setPostingsApplications((prev) => [
                ...prev,
                ...result.data,
            ]);
            setCursorInfo(result.page.cursor);
            setTotalCount(result.page.totalCount);
        } catch (error) {
            console.error(
                '공고 지원 목록 조회 오류:',
                error
            );
        }
    };

    return (
        <Container>
            <ListArea id='scrollableListArea'>
                <InfiniteScroll
                    dataLength={postingsApplications.length}
                    next={fetchData}
                    hasMore={
                        postingsApplications.length <
                        totalCount
                    }
                    loader={
                        <CenteredDiv>
                            <Loader />
                        </CenteredDiv>
                    }
                    scrollableTarget='scrollableListArea'
                >
                    {postingsApplications.map((post) => (
                        <PostingsApplicationsItem
                            key={post.id}
                            id={post.id}
                            createdAt={post.createdAt}
                            workspaceName={
                                post.workspaceName
                            }
                            status={post.status}
                            schedule={post.schedule}
                        />
                    ))}
                </InfiniteScroll>
            </ListArea>
        </Container>
    );
};

export default PostingsApplicationsList;

const Container = styled.div`
    width: 50vw;
    height: calc(100vh - 80px); /* 화면 전체 높이 */
    background-color: #ffffff;
    display: flex;
    border-radius: 8px;
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
