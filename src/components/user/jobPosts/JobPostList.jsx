import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import searchSvg from '../../../assets/icons/searchSvg.svg';
import dropdownIcon from '../../../assets/icons/dropdown.svg';
import JobPostItem from './JobPostItem';
import { getPostList } from '../../../services/post';
import Loader from '../../Loader';

const JobPostList = ({
    posts: externalPosts,
    cursor: externalCursor,
    totalCount: externalTotalCount,
    onLoadMore: externalLoadMore,
    onSelect,
    scrapMap,
    onScrapChange,
    searchValue,
    onSearchInputChange,
    onSearchSubmit,
    sortValue,
    onSortChange,
}) => {
    const [posts, setPosts] = useState([]);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [internalSearch, setInternalSearch] =
        useState('');
    const [internalSort, setInternalSort] =
        useState('LATEST');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef(null);

    const isControlled =
        typeof onSearchInputChange === 'function';
    const currentSearchValue = isControlled
        ? searchValue ?? ''
        : internalSearch;
    const currentSortValue =
        typeof onSortChange === 'function' && sortValue
            ? sortValue
            : internalSort;

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

    // cursorInfo를 ref로 관리하여 dependency 문제 해결
    const cursorInfoRef = useRef('');

    useEffect(() => {
        cursorInfoRef.current = cursorInfo;
    }, [cursorInfo]);

    const fetchData = useCallback(
        async ({ reset = false } = {}) => {
            try {
                // 외부 데이터가 있으면 지도 API 사용, 없으면 일반 API 사용
                if (
                    externalPosts !== undefined &&
                    externalLoadMore
                ) {
                    // 지도 API를 통한 추가 데이터 로드
                    await externalLoadMore();
                } else if (externalPosts === undefined) {
                    const requestCursor = reset
                        ? ''
                        : cursorInfoRef.current;
                    if (reset) {
                        setCursorInfo('');
                        cursorInfoRef.current = '';
                    }
                    const result = await getPostList({
                        cursorInfo: requestCursor,
                        search: currentSearchValue,
                    });

                    console.log(
                        '공고 리스트 응답:',
                        result
                    );

                    // API 응답 형식 확인 및 처리
                    const postsData = result?.data || [];
                    const pageInfo = result?.page || {};

                    setPosts((prev) =>
                        reset
                            ? postsData
                            : [...prev, ...postsData]
                    );
                    const newCursor = pageInfo.cursor || '';
                    setCursorInfo(newCursor);
                    cursorInfoRef.current = newCursor;
                    setTotalCount(pageInfo.totalCount || 0);
                    setHasMore(!!newCursor);
                }
            } catch (error) {
                console.error(
                    '공고 리스트 조회 오류:',
                    error
                );
            }
        },
        [
            externalPosts,
            externalLoadMore,
            currentSearchValue,
            currentSortValue,
        ]
    );

    // 초기 로드
    useEffect(() => {
        // externalPosts가 전달되지 않았을 때만 자체 fetchData 호출
        if (externalPosts === undefined) {
            fetchData({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchInput = (event) => {
        const { value } = event.target;
        if (isControlled) {
            onSearchInputChange?.(value);
        } else {
            setInternalSearch(value);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (isControlled) {
            onSearchSubmit?.();
        } else {
            setPosts([]);
            setCursorInfo('');
            cursorInfoRef.current = '';
            setHasMore(true);
            // 검색 시에는 약간의 지연을 두어 상태 업데이트 후 호출
            setTimeout(() => {
                fetchData({ reset: true });
            }, 0);
        }
    };

    const closeSortDropdown = () => setIsSortOpen(false);

    useEffect(() => {
        if (!isSortOpen) return undefined;

        const handleClickOutside = (event) => {
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(
                    event.target
                )
            ) {
                closeSortDropdown();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeSortDropdown();
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
            document.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, [isSortOpen]);

    useEffect(() => {
        closeSortDropdown();
    }, [currentSortValue]);

    const handleSortToggle = () => {
        setIsSortOpen((prev) => !prev);
    };

    const handleSortOptionSelect = (value) => {
        if (typeof onSortChange === 'function') {
            onSortChange(value);
        } else {
            setInternalSort(value);
            setPosts([]);
            setCursorInfo('');
            cursorInfoRef.current = '';
            setHasMore(true);
            // 정렬 변경 시에는 약간의 지연을 두어 상태 업데이트 후 호출
            setTimeout(() => {
                fetchData({ reset: true });
            }, 0);
        }
        closeSortDropdown();
    };

    const loadMorePosts = () => fetchData();

    return (
        <Container>
            <Controls>
                <SearchForm onSubmit={handleSearchSubmit}>
                    <SearchInputWrapper>
                        <SearchInput
                            type='text'
                            value={currentSearchValue}
                            onChange={handleSearchInput}
                            placeholder='공고 또는 업장명 검색'
                        />
                        <SearchSubmitButton
                            type='submit'
                            aria-label='검색 실행'
                        >
                            <img
                                src={searchSvg}
                                alt='검색'
                            />
                        </SearchSubmitButton>
                    </SearchInputWrapper>
                </SearchForm>
                <SortDropdown ref={sortDropdownRef}>
                    <SortDropdownButton
                        type='button'
                        onClick={handleSortToggle}
                        aria-haspopup='true'
                        aria-expanded={isSortOpen}
                        $isOpen={isSortOpen}
                    >
                        <span>
                            {currentSortValue ===
                            'PAY_AMOUNT'
                                ? '급여 높은 순'
                                : '최신 등록 순'}
                        </span>
                        <img
                            src={dropdownIcon}
                            alt='드롭다운'
                        />
                    </SortDropdownButton>
                    {isSortOpen && (
                        <SortDropdownMenu role='menu'>
                            <SortDropdownItem
                                type='button'
                                role='menuitem'
                                aria-selected={
                                    currentSortValue ===
                                    'LATEST'
                                }
                                onClick={() =>
                                    handleSortOptionSelect(
                                        'LATEST'
                                    )
                                }
                            >
                                최신 등록 순
                            </SortDropdownItem>
                            <SortDropdownItem
                                type='button'
                                role='menuitem'
                                aria-selected={
                                    currentSortValue ===
                                    'PAY_AMOUNT'
                                }
                                onClick={() =>
                                    handleSortOptionSelect(
                                        'PAY_AMOUNT'
                                    )
                                }
                            >
                                급여 높은 순
                            </SortDropdownItem>
                        </SortDropdownMenu>
                    )}
                </SortDropdown>
            </Controls>
            <Divider />
            <ListArea id='scrollableListArea'>
                {/* <Address>서울 구로구 경인로 445</Address> */}
                {posts.length === 0 && !hasMore ? (
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
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={loadMorePosts}
                        hasMore={
                            hasMore &&
                            posts.length < totalCount
                        }
                        loader={
                            <CenteredDiv>
                                <Loader />
                            </CenteredDiv>
                        }
                        scrollableTarget='scrollableListArea'
                    >
                        {posts.map((post) => (
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
                        ))}
                    </InfiniteScroll>
                )}
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

const Controls = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px 0 20px;

    @media (max-width: 768px) {
        padding: 14px 16px 0 16px;
    }

    @media (max-width: 480px) {
        padding: 12px 12px 0 12px;
    }
`;

const SearchForm = styled.form`
    flex: 1;
    display: flex;
`;

const SearchInputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 46px;
    padding: 0 44px 0 16px;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    font-size: 16px;
    font-family: 'Pretendard';
    color: #333333;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #399982;
        box-shadow: 0 0 0 3px rgba(57, 153, 130, 0.12);
    }

    &::placeholder {
        color: #999999;
    }

    @media (max-width: 768px) {
        height: 44px;
    }

    @media (max-width: 480px) {
        height: 42px;
        font-size: 15px;
    }
`;

const SearchSubmitButton = styled.button`
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    -webkit-tap-highlight-color: transparent;

    img {
        width: 20px;
        height: 20px;
    }
`;

const SortDropdown = styled.div`
    position: relative;
    flex-shrink: 0;
    min-width: 150px;

    @media (max-width: 768px) {
        min-width: 140px;
    }

    @media (max-width: 480px) {
        min-width: 130px;
    }
`;

const SortDropdownButton = styled.button`
    height: 46px;
    padding: 0 14px;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'Pretendard';
    color: #333333;
    background: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease,
        background 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:focus {
        outline: none;
        border-color: #399982;
        box-shadow: 0 0 0 3px rgba(57, 153, 130, 0.12);
    }

    &:hover {
        background: #f8fffe;
        border-color: #399982;
    }

    img {
        width: 16px;
        height: 16px;
        transition: transform 0.2s ease;
        transform: rotate(
            ${(props) =>
                props.$isOpen ? '180deg' : '0deg'}
        );
    }

    @media (max-width: 768px) {
        height: 44px;
        padding: 0 12px;
    }

    @media (max-width: 480px) {
        height: 42px;
        font-size: 14px;
    }
`;

const SortDropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 100%;
    max-width: 220px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(17, 17, 17, 0.12);
    padding: 6px 0;
    display: flex;
    flex-direction: column;
    z-index: 30;
`;

const SortDropdownItem = styled.button`
    width: 100%;
    padding: 10px 16px;
    text-align: left;
    background: none;
    border: none;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: ${(props) =>
        props['aria-selected'] ? '#256857' : '#333333'};
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
        background: rgba(57, 153, 130, 0.08);
        color: #256857;
    }

    &:active {
        background: rgba(57, 153, 130, 0.14);
        color: #174d3b;
    }
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0; /* flexbox에서 overflow 작동 위해 필요 */
    -webkit-overflow-scrolling: touch;
    position: relative;
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
