import {
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import NaverMap from '../../components/owner/NaverMap';
import JobPostItem from '../../components/user/jobPosts/JobPostItem';
import JobPostDetailOverlay from '../../components/user/jobPosts/JobPostDetailOverlay';
import JobApplyOverlay from '../../components/user/jobPosts/JobApplyOverlay';
import RegionFilter from '../../components/user/RegionFilter';
import BottomNavigation from '../../layouts/BottomNavigation';
import useScrapStore from '../../store/scrapStore';
import { getPostList } from '../../services/post';
import Loader from '../../components/Loader';
import searchSvg from '../../assets/icons/searchSvg.svg';
import dropdownIcon from '../../assets/icons/dropdown.svg';
import filterIcon from '../../assets/icons/filterIcon.svg';
import mapIcon from '../../assets/icons/mapIcon.svg';
import listIcon from '../../assets/icons/listIcon.svg';

const JobListPage = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const { scrapMap, initializeScrapMap, toggleScrap } =
        useScrapStore();
    const [jobPostings, setJobPostings] = useState([]);
    const [jobPostingsCursor, setJobPostingsCursor] =
        useState('');
    const [
        jobPostingsTotalCount,
        setJobPostingsTotalCount,
    ] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedPostId, setSelectedPostId] =
        useState(null);
    const [showDetailOverlay, setShowDetailOverlay] =
        useState(false);
    const [showApplyOverlay, setShowApplyOverlay] =
        useState(false);
    const [applyPostId, setApplyPostId] = useState(null);
    const mapRef = useRef(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('LATEST');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState(
        []
    );
    const sortDropdownRef = useRef(null);
    const cursorInfoRef = useRef('');
    const isInitialFilterRef = useRef(true);
    const valueOrEmpty = (value) => (value || '').trim();

    const handlePostSelect = (post) => {
        setSelectedPostId(post.id);
        setShowDetailOverlay(true);
    };

    const handleCloseDetailOverlay = () => {
        setShowDetailOverlay(false);
        setSelectedPostId(null);
    };

    const handleApply = (postDetail) => {
        handleCloseDetailOverlay();
        setApplyPostId(postDetail.id);
        setShowApplyOverlay(true);
    };

    const handleCloseApplyOverlay = () => {
        const currentApplyPostId = applyPostId;
        setShowApplyOverlay(false);
        setApplyPostId(null);
        setSelectedPostId(currentApplyPostId);
        setShowDetailOverlay(true);
    };

    const handleApplySuccess = () => {
        console.log('지원이 완료되었습니다.');
    };

    const handleJobPostingsUpdate = (data) => {
        if (viewMode === 'map') {
            setJobPostings(data.postings || []);
            setJobPostingsCursor(data.cursor || '');
            setJobPostingsTotalCount(data.totalCount || 0);
        }
    };

    // cursorInfo를 ref로 관리
    useEffect(() => {
        cursorInfoRef.current = jobPostingsCursor;
    }, [jobPostingsCursor]);

    // 선택된 지역 정보를 ref로 관리
    const selectedRegionsRef = useRef([]);
    useEffect(() => {
        selectedRegionsRef.current = selectedRegions;
    }, [selectedRegions]);

    // 공고 리스트 조회
    const fetchPostList = useCallback(
        async ({ reset = false } = {}) => {
            if (viewMode !== 'list') return;

            try {
                const requestCursor = reset
                    ? ''
                    : cursorInfoRef.current;
                if (reset) {
                    setJobPostingsCursor('');
                    cursorInfoRef.current = '';
                }

                // 선택된 지역 정보 파싱
                let province = '';
                let district = '';
                let town = '';

                const currentRegions =
                    selectedRegionsRef.current;
                if (currentRegions.length > 0) {
                    const firstRegion = currentRegions[0];
                    province = firstRegion.province || '';
                    district = firstRegion.district || '';
                    town = firstRegion.town || '';
                }

                const result = await getPostList({
                    cursorInfo: requestCursor,
                    search: searchKeyword,
                    province,
                    district,
                    town,
                });

                console.log('공고 리스트 응답:', result);

                const postsData = result?.data || [];
                const pageInfo = result?.page || {};

                setJobPostings((prev) =>
                    reset
                        ? postsData
                        : [...prev, ...postsData]
                );
                const newCursor = pageInfo.cursor || '';
                setJobPostingsCursor(newCursor);
                cursorInfoRef.current = newCursor;
                setJobPostingsTotalCount(
                    pageInfo.totalCount || 0
                );
                setHasMore(!!newCursor);
            } catch (error) {
                console.error(
                    '공고 리스트 조회 오류:',
                    error
                );
            }
        },
        [viewMode, searchKeyword, sortType]
    );

    const handleMapMoved = () => {
        // 지도 이동 시 처리
    };

    const handleCurrentLocationStatusChange = (
        isAtCurrent
    ) => {
        // 현재 위치 상태 변경 시 처리
    };

    const handleMapBackgroundClick = () => {
        // 지도 배경 클릭 시 처리
    };

    const handleMarkerClick = (bounds) => {
        // 마커 클릭 시 처리
    };

    // 검색어, 정렬, 지역 필터 변경 시 리스트 다시 불러오기
    const selectedRegionsKey = JSON.stringify(
        selectedRegions.map((r) => r.code)
    );

    // 초기 로드 및 리스트 모드일 때 데이터 로드
    useEffect(() => {
        if (viewMode === 'list') {
            fetchPostList({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode]);

    // 검색어, 정렬, 지역 필터 변경 시 리스트 다시 불러오기
    useEffect(() => {
        if (viewMode === 'list') {
            fetchPostList({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword, sortType, selectedRegionsKey]);

    // 지도 모드일 때만 마커 새로고침
    useEffect(() => {
        if (isInitialFilterRef.current) {
            isInitialFilterRef.current = false;
            return;
        }

        if (
            viewMode === 'map' &&
            mapRef.current &&
            mapRef.current.refreshMarkers
        ) {
            mapRef.current.refreshMarkers({
                searchKeyword,
                sortType,
            });
        }
    }, [searchKeyword, sortType, viewMode]);

    const handleSearchInputChange = (value) => {
        setSearchInput(value);
    };

    const handleSearchSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        const trimmedValue = valueOrEmpty(searchInput);
        if (trimmedValue === searchKeyword) {
            if (
                viewMode === 'map' &&
                mapRef.current &&
                mapRef.current.refreshMarkers
            ) {
                mapRef.current.refreshMarkers({
                    searchKeyword: trimmedValue,
                    sortType,
                });
            }
            return;
        }
        setSearchKeyword(trimmedValue);
    };

    const handleSortToggle = () => {
        setIsSortOpen((prev) => !prev);
    };

    const handleSortChange = (value) => {
        if (value === sortType) {
            if (
                viewMode === 'map' &&
                mapRef.current &&
                mapRef.current.refreshMarkers
            ) {
                mapRef.current.refreshMarkers({
                    searchKeyword,
                    sortType: value,
                });
            }
            setIsSortOpen(false);
            return;
        }
        setSortType(value);
        setIsSortOpen(false);
    };

    const handleLoadMore = () => {
        if (viewMode === 'list') {
            fetchPostList({ reset: false });
        } else if (
            viewMode === 'map' &&
            mapRef.current &&
            mapRef.current.loadMoreJobPostings
        ) {
            mapRef.current.loadMoreJobPostings(
                jobPostingsCursor
            );
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

    const handleToggleView = () => {
        setViewMode((prev) =>
            prev === 'list' ? 'map' : 'list'
        );
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        if (jobPostings.length > 0) {
            initializeScrapMap(jobPostings);
        }
    }, [jobPostings, initializeScrapMap]);

    return (
        <Container>
            {viewMode === 'map' ? (
                <MapSection>
                    <NaverMap
                        ref={mapRef}
                        onJobPostingsUpdate={
                            handleJobPostingsUpdate
                        }
                        onMapMoved={handleMapMoved}
                        onCurrentLocationStatusChange={
                            handleCurrentLocationStatusChange
                        }
                        onMapBackgroundClick={
                            handleMapBackgroundClick
                        }
                        onMarkerClick={handleMarkerClick}
                        searchKeyword={searchKeyword}
                        sortType={sortType}
                    />
                </MapSection>
            ) : (
                <ListSection>
                    <ListContainer>
                        <Controls>
                            <SearchForm
                                onSubmit={
                                    handleSearchSubmit
                                }
                            >
                                <SearchInputWrapper>
                                    <SearchInput
                                        type='text'
                                        value={searchInput}
                                        onChange={(e) =>
                                            handleSearchInputChange(
                                                e.target
                                                    .value
                                            )
                                        }
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
                            <FilterRow>
                                <SortDropdown
                                    ref={sortDropdownRef}
                                >
                                    <SortDropdownButton
                                        type='button'
                                        onClick={
                                            handleSortToggle
                                        }
                                        aria-haspopup='true'
                                        aria-expanded={
                                            isSortOpen
                                        }
                                        $isOpen={isSortOpen}
                                    >
                                        <span>
                                            {sortType ===
                                            'PAY_AMOUNT'
                                                ? '급여 높은 순'
                                                : '최신 등록 '}
                                        </span>
                                        <img
                                            src={
                                                dropdownIcon
                                            }
                                            alt='드롭다운'
                                        />
                                    </SortDropdownButton>
                                    {isSortOpen && (
                                        <SortDropdownMenu role='menu'>
                                            <SortDropdownItem
                                                type='button'
                                                role='menuitem'
                                                aria-selected={
                                                    sortType ===
                                                    'LATEST'
                                                }
                                                onClick={() =>
                                                    handleSortChange(
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
                                                    sortType ===
                                                    'PAY_AMOUNT'
                                                }
                                                onClick={() =>
                                                    handleSortChange(
                                                        'PAY_AMOUNT'
                                                    )
                                                }
                                            >
                                                급여 높은 순
                                            </SortDropdownItem>
                                        </SortDropdownMenu>
                                    )}
                                </SortDropdown>
                                <FilterButton
                                    type='button'
                                    onClick={() =>
                                        setIsFilterOpen(
                                            true
                                        )
                                    }
                                    aria-label='필터'
                                >
                                    <img
                                        src={filterIcon}
                                        alt='필터'
                                    />
                                </FilterButton>
                            </FilterRow>
                        </Controls>
                        <Divider />
                        <ListArea id='scrollableListArea'>
                            {jobPostings.length === 0 &&
                            !hasMore ? (
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
                                        다른 지역을
                                        검색해보세요
                                    </EmptySubText>
                                </EmptyMessage>
                            ) : (
                                <InfiniteScroll
                                    dataLength={
                                        jobPostings.length
                                    }
                                    next={handleLoadMore}
                                    hasMore={
                                        hasMore &&
                                        jobPostings.length <
                                            jobPostingsTotalCount
                                    }
                                    loader={
                                        <CenteredDiv>
                                            <Loader />
                                        </CenteredDiv>
                                    }
                                    scrollableTarget='scrollableListArea'
                                >
                                    {jobPostings.map(
                                        (post) => (
                                            <JobPostItem
                                                key={
                                                    post.id
                                                }
                                                {...post}
                                                onClick={() =>
                                                    handlePostSelect(
                                                        post
                                                    )
                                                }
                                                checked={
                                                    scrapMap[
                                                        post
                                                            .id
                                                    ] ??
                                                    post.scrapped
                                                }
                                                onScrapChange={(
                                                    value
                                                ) =>
                                                    toggleScrap(
                                                        post.id,
                                                        value
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </InfiniteScroll>
                            )}
                        </ListArea>
                        <RegionFilter
                            isOpen={isFilterOpen}
                            onClose={() =>
                                setIsFilterOpen(false)
                            }
                            selectedRegions={
                                selectedRegions
                            }
                            onRegionsChange={
                                setSelectedRegions
                            }
                            maxRegions={10}
                        />
                    </ListContainer>
                </ListSection>
            )}

            <ToggleButton
                onClick={handleToggleView}
                aria-label={
                    viewMode === 'list'
                        ? '지도 보기'
                        : '리스트 보기'
                }
            >
                <img
                    src={
                        viewMode === 'list'
                            ? mapIcon
                            : listIcon
                    }
                    alt={
                        viewMode === 'list'
                            ? '지도 보기'
                            : '리스트 보기'
                    }
                />
            </ToggleButton>

            <BottomNavigation />

            {showDetailOverlay && selectedPostId && (
                <JobPostDetailOverlay
                    postId={selectedPostId}
                    onClose={handleCloseDetailOverlay}
                    onApply={handleApply}
                />
            )}

            {showApplyOverlay && applyPostId && (
                <JobApplyOverlay
                    postId={applyPostId}
                    onClose={handleCloseApplyOverlay}
                    onApplySuccess={handleApplySuccess}
                />
            )}
        </Container>
    );
};

export default JobListPage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    max-width: 100vw;
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 0;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
`;

const MapSection = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const ListSection = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const ListContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px 0 20px;

    @media (max-width: 768px) {
        padding: 14px 16px 0 16px;
    }

    @media (max-width: 480px) {
        padding: 12px 12px 0 12px;
        gap: 10px;
    }
`;

const SearchForm = styled.form`
    width: 100%;
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

const FilterRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 480px) {
        gap: 10px;
    }
`;

const SortDropdown = styled.div`
    position: relative;
    flex: 1;
    min-width: 0;
`;

const SortDropdownButton = styled.button`
    width: 100%;
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
    left: 0;
    right: 0;
    width: 100%;
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

const FilterButton = styled.button`
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    background: #ffffff;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
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

    &:active {
        background: #f0f8f6;
    }

    img {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 768px) {
        width: 44px;
        height: 44px;
    }

    @media (max-width: 480px) {
        width: 42px;
        height: 42px;

        img {
            width: 18px;
            height: 18px;
        }
    }
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
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    -webkit-overflow-scrolling: touch;
    position: relative;
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

const ToggleButton = styled.button`
    position: fixed;
    bottom: 90px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #2de283;
    border: none;
    box-shadow: 0 4px 12px rgba(45, 226, 131, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    transition: all 0.3s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    padding: 0;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(45, 226, 131, 0.5);
    }

    &:active {
        transform: scale(0.95);
        box-shadow: 0 2px 8px rgba(45, 226, 131, 0.3);
    }

    img {
        width: 24px;
        height: 24px;
    }

    @media (max-width: 768px) {
        bottom: 80px;
        right: 20px;
        width: 56px;
        height: 56px;
    }

    @supports (padding: max(0px)) {
        bottom: max(
            90px,
            calc(90px + env(safe-area-inset-bottom))
        );

        @media (max-width: 768px) {
            bottom: max(
                80px,
                calc(80px + env(safe-area-inset-bottom))
            );
        }
    }
`;
