import JobPostItem from './JobPostItem';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import { getPostList } from '../../../services/post';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../Loader';

const JobPostList = ({
    posts: externalPosts,
    cursor: externalCursor,
    totalCount: externalTotalCount,
    onLoadMore: externalLoadMore,
    onSelect,
    scrapMap,
    onScrapChange,
}) => {
    const [posts, setPosts] = useState([]);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [salaryValue, setSalaryValue] = useState('');
    const [regionValue, setRegionValue] = useState('');
    const [hasMore, setHasMore] = useState(true);

    // 외부에서 전달받은 posts가 있으면 업데이트
    useEffect(() => {
        if (externalPosts !== undefined) {
            setPosts(externalPosts);
            if (externalCursor !== undefined) {
                setCursorInfo(externalCursor);
            }
            if (externalTotalCount !== undefined) {
                setTotalCount(externalTotalCount);
            }
            // cursor가 있으면 무한스크롤 활성화, 없으면 비활성화
            setHasMore(
                externalCursor && externalCursor !== ''
            );
        }
    }, [externalPosts, externalCursor, externalTotalCount]);

    useEffect(() => {
        // externalPosts가 전달되지 않았을 때만 자체 fetchData 호출
        if (externalPosts === undefined) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            // 외부 데이터가 있으면 지도 API 사용, 없으면 일반 API 사용
            if (
                externalPosts !== undefined &&
                externalLoadMore
            ) {
                // 지도 API를 통한 추가 데이터 로드
                await externalLoadMore();
            } else if (externalPosts === undefined) {
                const result = await getPostList({
                    cursorInfo,
                    search: searchValue,
                    sort: sortValue,
                    salary: salaryValue,
                    region: regionValue,
                });
                setPosts((prev) => [
                    ...prev,
                    ...result.data,
                ]);
                setCursorInfo(result.page.cursor);
                setTotalCount(result.page.totalCount);
            }
        } catch (error) {
            console.error('공고 리스트 조회 오류:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        // 검색어 변경 시 리스트 초기화 및 새로 로드
        setPosts([]);
        setCursorInfo('');
        fetchData();
    };

    const handleSortChange = () => {
        // 정렬 옵션 모달 또는 드롭다운 표시
        console.log('정렬 옵션 선택');
    };

    const handleSalaryChange = () => {
        // 급여 옵션 모달 또는 드롭다운 표시
        console.log('급여 옵션 선택');
    };

    const handleRegionChange = () => {
        // 지역 옵션 모달 또는 드롭다운 표시
        console.log('지역 옵션 선택');
    };

    return (
        <Container>
            <SearchBar
                value={searchValue}
                onChange={handleSearchChange}
                placeholder='알바를 검색해보세요'
            />
            <FilterBar
                sortValue={sortValue}
                onSortChange={handleSortChange}
                salaryValue={salaryValue}
                onSalaryChange={handleSalaryChange}
                regionValue={regionValue}
                onRegionChange={handleRegionChange}
            />
            <Divider />
            <ListArea id='scrollableListArea'>
                {/* <Address>서울 구로구 경인로 445</Address> */}
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchData}
                    hasMore={
                        hasMore && posts.length < totalCount
                    }
                    loader={
                        <CenteredDiv>
                            <Loader />
                        </CenteredDiv>
                    }
                    scrollableTarget='scrollableListArea'
                >
                    {posts.length === 0 ? (
                        <EmptyMessage>
                            <EmptyIcon>
                                <svg
                                    width='48'
                                    height='48'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                >
                                    <path
                                        d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
                                        fill='#ccc'
                                    />
                                </svg>
                            </EmptyIcon>
                            <EmptyText>
                                공고가 없습니다
                            </EmptyText>
                            <EmptySubText>
                                다른 지역을 검색해보세요
                            </EmptySubText>
                        </EmptyMessage>
                    ) : (
                        posts.map((post) => (
                            <JobPostItem
                                key={post.id}
                                {...post}
                                onClick={() =>
                                    onSelect(post)
                                }
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
                        ))
                    )}
                </InfiniteScroll>
            </ListArea>
        </Container>
    );
};

export default JobPostList;

const Container = styled.div`
    width: 100%;
    height: 100%;
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
    height: 1px;
    background: #f6f6f6;
    margin: 20px 0 16px 0;

    @media (max-width: 768px) {
        margin: 18px 0 14px 0;
    }

    @media (max-width: 480px) {
        margin: 16px 0 12px 0;
    }

    @media (max-width: 360px) {
        margin: 14px 0 10px 0;
    }

    @media (max-width: 320px) {
        margin: 12px 0 8px 0;
    }
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const EmptyMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
`;

const EmptyIcon = styled.div`
    margin-bottom: 16px;
    opacity: 0.6;
`;

const EmptyText = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;

    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

const EmptySubText = styled.div`
    font-size: 14px;
    color: #999;

    @media (max-width: 480px) {
        font-size: 13px;
    }
`;
