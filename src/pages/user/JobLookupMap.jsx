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
import JobPostList from '../../components/user/jobPosts/JobPostList';
import JobPostItem from '../../components/user/jobPosts/JobPostItem';
import MarkerJobPostList from '../../components/user/jobPosts/MarkerJobPostList';
import JobPostDetailOverlay from '../../components/user/jobPosts/JobPostDetailOverlay';
import JobApplyOverlay from '../../components/user/jobPosts/JobApplyOverlay';
import RegionFilter from '../../components/user/RegionFilter';
import BottomNavigation from '../../layouts/BottomNavigation';
import useScrapStore from '../../store/scrapStore';
import { getPostList } from '../../services/post';
import Loader from '../../components/Loader';
import filterIcon from '../../assets/icons/filterIcon.svg';
import mapIcon from '../../assets/icons/mapIcon.svg';
import mapViewIcon from '../../assets/icons/mapViewIcon.svg';
import listIcon from '../../assets/icons/listIcon.svg';

const JobLookupMap = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
    const [listHeight, setListHeight] = useState(40);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);
    // 스크랩 전역 상태 사용
    const { scrapMap, initializeScrapMap, toggleScrap } =
        useScrapStore();
    const [velocity, setVelocity] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [lastTime, setLastTime] = useState(0);
    const [jobPostings, setJobPostings] = useState([]);
    const [jobPostingsCursor, setJobPostingsCursor] =
        useState('');
    const [
        jobPostingsTotalCount,
        setJobPostingsTotalCount,
    ] = useState(0);
    const [showSearchButton, setShowSearchButton] =
        useState(false);
    const [isAtCurrentLocation, setIsAtCurrentLocation] =
        useState(true);
    const [isWorkspaceView, setIsWorkspaceView] =
        useState(false); // 마커별 조회 모드인지 여부
    const [savedBounds, setSavedBounds] = useState(null); // 마커 클릭 전 지도 뷰 좌표 저장
    const savedBoundsRef = useRef(null); // ref로도 저장하여 즉시 접근 가능
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
    const isInitialFilterRef = useRef(true);
    const valueOrEmpty = (value) => (value || '').trim();

    // 리스트 모드용 state
    const [listPostings, setListPostings] = useState([]);
    const [listCursor, setListCursor] = useState('');
    const [listTotalCount, setListTotalCount] = useState(0);
    const [listHasMore, setListHasMore] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState(
        []
    );
    const listCursorInfoRef = useRef('');
    const selectedRegionsRef = useRef([]);

    const handleSearchClick = () => {
        if (
            mapRef.current &&
            mapRef.current.refreshMarkers
        ) {
            // 검색 버튼 숨기기
            setShowSearchButton(false);
            // 마커와 공고 리스트 로드 (콜백으로 자동 업데이트)
            mapRef.current.refreshMarkers({
                searchKeyword,
                sortType,
            });
        }
    };

    const handleCurrentLocationClick = () => {
        if (
            mapRef.current &&
            mapRef.current.goToCurrentLocation
        ) {
            mapRef.current.goToCurrentLocation();
        }
    };

    const handleMapBackgroundClick = () => {
        // 지도 배경 클릭 시 하단 스크롤바 접기
        setListHeight(40);

        // 전체 조회 모드로 복원
        setIsWorkspaceView(false);

        // 저장된 좌표로 다시 조회 (ref 사용)
        const boundsToUse =
            savedBoundsRef.current || savedBounds;

        if (
            boundsToUse &&
            mapRef.current &&
            mapRef.current.loadJobPostingsInBounds
        ) {
            mapRef.current.loadJobPostingsInBounds(
                boundsToUse
            );
        }
    };

    const handleMarkerClick = (bounds) => {
        setSavedBounds(bounds);
        // ref에도 동시에 저장하여 즉시 접근 가능
        savedBoundsRef.current = bounds;
    };

    const handlePostSelect = (post) => {
        setSelectedPostId(post.id);
        setShowDetailOverlay(true);
    };

    const handleCloseDetailOverlay = () => {
        setShowDetailOverlay(false);
        setSelectedPostId(null);
    };

    const handleApply = (postDetail) => {
        // 상세 오버레이 닫기
        handleCloseDetailOverlay();
        // 지원 오버레이 열기
        setApplyPostId(postDetail.id);
        setShowApplyOverlay(true);
    };

    const handleCloseApplyOverlay = () => {
        // 지원 오버레이를 닫고 상세 오버레이를 다시 열기
        const currentApplyPostId = applyPostId;
        setShowApplyOverlay(false);
        setApplyPostId(null);
        setSelectedPostId(currentApplyPostId);
        setShowDetailOverlay(true);
    };

    const handleApplySuccess = () => {
        // 지원 성공 시 추가 처리 (예: 토스트 메시지 등)
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
        listCursorInfoRef.current = listCursor;
    }, [listCursor]);

    // 선택된 지역 정보를 ref로 관리
    useEffect(() => {
        selectedRegionsRef.current = selectedRegions;
    }, [selectedRegions]);

    // 리스트 모드용 공고 리스트 조회
    const fetchListPostList = useCallback(
        async ({ reset = false } = {}) => {
            if (viewMode !== 'list') return;

            try {
                const requestCursor = reset
                    ? ''
                    : listCursorInfoRef.current;
                if (reset) {
                    setListCursor('');
                    listCursorInfoRef.current = '';
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
                    province,
                    district,
                    town,
                });

                console.log('공고 리스트 응답:', result);

                const postsData = result?.data || [];
                const pageInfo = result?.page || {};

                setListPostings((prev) =>
                    reset
                        ? postsData
                        : [...prev, ...postsData]
                );
                const newCursor = pageInfo.cursor || '';
                setListCursor(newCursor);
                listCursorInfoRef.current = newCursor;
                setListTotalCount(pageInfo.totalCount || 0);
                setListHasMore(!!newCursor);
            } catch (error) {
                console.error(
                    '공고 리스트 조회 오류:',
                    error
                );
            }
        },
        [viewMode]
    );

    useEffect(() => {
        if (isInitialFilterRef.current) {
            isInitialFilterRef.current = false;
            return;
        }

        if (
            mapRef.current &&
            mapRef.current.refreshMarkers
        ) {
            setShowSearchButton(false);
            mapRef.current.refreshMarkers({
                searchKeyword,
                sortType,
            });
        }
    }, [searchKeyword, sortType]);

    const handleSearchInputChange = (value) => {
        setSearchInput(value);
    };

    const handleSearchSubmit = () => {
        const trimmedValue = valueOrEmpty(searchInput);
        if (trimmedValue === searchKeyword) {
            if (
                mapRef.current &&
                mapRef.current.refreshMarkers
            ) {
                setShowSearchButton(false);
                mapRef.current.refreshMarkers({
                    searchKeyword: trimmedValue,
                    sortType,
                });
            }
            return;
        }
        setSearchKeyword(trimmedValue);
    };

    const handleSortChange = (value) => {
        if (value === sortType) {
            if (
                mapRef.current &&
                mapRef.current.refreshMarkers
            ) {
                setShowSearchButton(false);
                mapRef.current.refreshMarkers({
                    searchKeyword,
                    sortType: value,
                });
            }
            return;
        }
        setSortType(value);
    };

    const handleListLoadMore = () => {
        if (viewMode === 'list') {
            fetchListPostList({ reset: false });
        }
    };

    const handleToggleView = () => {
        setViewMode((prev) =>
            prev === 'map' ? 'list' : 'map'
        );
    };

    useEffect(() => {
        // 페이지 로드 시 body 스크롤 방지
        document.body.style.overflow = 'hidden';

        // Flutter 웹뷰에서 네이티브 화면 정보 수신
        const handleNativeDataInjected = (event) => {
            if (event.detail && event.detail.screen) {
                window.nativeScreenInfo =
                    event.detail.screen;
                console.log(
                    '네이티브 화면 정보 수신:',
                    window.nativeScreenInfo
                );

                // 화면 정보에 따라 동적으로 스타일 적용
                applyNativeScreenStyles(
                    event.detail.screen
                );
            }
        };

        // 네이티브 데이터 주입 이벤트 리스너 등록
        window.addEventListener(
            'nativeDataInjected',
            handleNativeDataInjected
        );

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener(
                'nativeDataInjected',
                handleNativeDataInjected
            );
        };
    }, []);

    // 네이티브 화면 정보에 따른 스타일 적용 함수
    const applyNativeScreenStyles = (screenInfo) => {
        const { statusBarHeight, bottomPadding } =
            screenInfo;

        // CSS 변수로 화면 정보 설정
        document.documentElement.style.setProperty(
            '--status-bar-height',
            `${statusBarHeight}px`
        );
        document.documentElement.style.setProperty(
            '--bottom-padding',
            `${bottomPadding}px`
        );

        // 지도 컨테이너 스타일 조정
        const mapContainer = document.querySelector(
            '[data-testid="map-container"]'
        );
        if (mapContainer) {
            mapContainer.style.paddingTop = `${statusBarHeight}px`;
        }
    };

    // 스크랩 상태 초기화 (공고 데이터 로드 시)
    useEffect(() => {
        if (jobPostings.length > 0) {
            initializeScrapMap(jobPostings);
        }
    }, [jobPostings, initializeScrapMap]);

    // 리스트 모드용 스크랩 상태 초기화
    useEffect(() => {
        if (listPostings.length > 0) {
            initializeScrapMap(listPostings);
        }
    }, [listPostings, initializeScrapMap]);

    // 리스트 모드일 때 초기 로드 및 필터 변경 시 데이터 로드
    const selectedRegionsKey = JSON.stringify(
        selectedRegions.map((r) => r.code)
    );

    useEffect(() => {
        if (viewMode === 'list') {
            fetchListPostList({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchListPostList({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegionsKey]);

    const handleTouchStart = (e) => {
        setIsDragging(true);
        const touchY = e.touches[0].clientY;
        setStartY(touchY);
        setStartHeight(listHeight);
        setLastY(touchY);
        setLastTime(Date.now());
        setVelocity(0);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const currentTime = Date.now();
        const deltaY = startY - currentY;

        // 속도 계산 (더 정확한 계산)
        const timeDelta = currentTime - lastTime;
        if (timeDelta > 0) {
            const velocityY =
                (lastY - currentY) / timeDelta;
            setVelocity(velocityY);
        }

        // 부드러운 드래그를 위한 제약 완화 (드래그 핸들이 보이도록 조정)
        const maxHeight = Math.min(
            window.innerHeight * 0.8,
            window.innerHeight - 120
        ); // 화면 높이의 80% 또는 하단 여백 고려
        const minHeight = 20; // 더 작은 최소값

        const newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight + deltaY)
        );
        setListHeight(newHeight);

        setLastY(currentY);
        setLastTime(currentTime);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);

        // 속도 기반 스냅 (드래그 핸들이 보이도록 조정)
        const maxHeight = Math.min(
            window.innerHeight * 0.8,
            window.innerHeight - 120
        ); // 화면 높이의 80% 또는 하단 여백 고려
        const minHeight = 40;
        const midHeight = window.innerHeight * 0.4;
        const largeHeight = window.innerHeight * 0.4;

        let targetHeight = minHeight;

        // 속도가 빠르면 방향에 따라 스냅
        if (Math.abs(velocity) > 0.5) {
            if (velocity > 0) {
                // 위로 드래그
                if (listHeight < midHeight) {
                    targetHeight = largeHeight;
                } else {
                    targetHeight = maxHeight;
                }
            } else {
                // 아래로 드래그
                if (listHeight > largeHeight) {
                    targetHeight = midHeight;
                } else {
                    targetHeight = minHeight;
                }
            }
        } else {
            // 속도가 느리면 현재 위치 기반 스냅
            if (listHeight < window.innerHeight * 0.2) {
                targetHeight = minHeight;
            } else if (
                listHeight <
                window.innerHeight * 0.5
            ) {
                targetHeight = midHeight;
            } else {
                targetHeight = largeHeight;
            }
        }

        setListHeight(targetHeight);
        setVelocity(0);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const mouseY = e.clientY;
        setStartY(mouseY);
        setStartHeight(listHeight);
        setLastY(mouseY);
        setLastTime(Date.now());
        setVelocity(0);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const currentY = e.clientY;
        const currentTime = Date.now();
        const deltaY = startY - currentY;

        // 속도 계산 (더 정확한 계산)
        const timeDelta = currentTime - lastTime;
        if (timeDelta > 0) {
            const velocityY =
                (lastY - currentY) / timeDelta;
            setVelocity(velocityY);
        }

        // 부드러운 드래그를 위한 제약 완화 (드래그 핸들이 보이도록 조정)
        const maxHeight = Math.min(
            window.innerHeight * 0.8,
            window.innerHeight - 120
        ); // 화면 높이의 80% 또는 하단 여백 고려
        const minHeight = 20; // 더 작은 최소값

        const newHeight = Math.max(
            minHeight,
            Math.min(maxHeight, startHeight + deltaY)
        );
        setListHeight(newHeight);

        setLastY(currentY);
        setLastTime(currentTime);
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        // 속도 기반 스냅 (터치와 동일한 로직, 드래그 핸들이 보이도록 조정)
        const maxHeight = Math.min(
            window.innerHeight * 0.8,
            window.innerHeight - 120
        ); // 화면 높이의 80% 또는 하단 여백 고려
        const minHeight = 40;
        const midHeight = window.innerHeight * 0.4;
        const largeHeight = window.innerHeight * 0.4;

        let targetHeight = minHeight;

        // 속도가 빠르면 방향에 따라 스냅
        if (Math.abs(velocity) > 0.5) {
            if (velocity > 0) {
                // 위로 드래그
                if (listHeight < midHeight) {
                    targetHeight = largeHeight;
                } else {
                    targetHeight = maxHeight;
                }
            } else {
                // 아래로 드래그
                if (listHeight > largeHeight) {
                    targetHeight = midHeight;
                } else {
                    targetHeight = minHeight;
                }
            }
        } else {
            // 속도가 느리면 현재 위치 기반 스냅
            if (listHeight < window.innerHeight * 0.2) {
                targetHeight = minHeight;
            } else if (
                listHeight <
                window.innerHeight * 0.5
            ) {
                targetHeight = midHeight;
            } else {
                targetHeight = largeHeight;
            }
        }

        setListHeight(targetHeight);
        setVelocity(0);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener(
                'mousemove',
                handleMouseMove
            );
            document.addEventListener(
                'mouseup',
                handleMouseUp
            );
            document.addEventListener(
                'touchmove',
                handleTouchMove,
                { passive: false }
            );
            document.addEventListener(
                'touchend',
                handleTouchEnd
            );
        }

        return () => {
            document.removeEventListener(
                'mousemove',
                handleMouseMove
            );
            document.removeEventListener(
                'mouseup',
                handleMouseUp
            );
            document.removeEventListener(
                'touchmove',
                handleTouchMove
            );
            document.removeEventListener(
                'touchend',
                handleTouchEnd
            );
        };
    }, [isDragging, startY, startHeight, listHeight]);

    return (
        <Container>
            {viewMode === 'map' && (
                <MapSection>
                    {showSearchButton && (
                        <SearchButton
                            onClick={handleSearchClick}
                        >
                            <SearchText>
                                이 지역에서 검색
                            </SearchText>
                        </SearchButton>
                    )}
                    <MapContainer data-testid='map-container'>
                        <NaverMap
                            ref={mapRef}
                            businessName='현재 위치'
                            searchKeyword={searchKeyword}
                            sortType={sortType}
                            onJobPostingsUpdate={(data) => {
                                if (
                                    typeof data ===
                                        'object' &&
                                    data.data
                                ) {
                                    setJobPostings(
                                        data.data
                                    );
                                    setJobPostingsCursor(
                                        data.cursor || ''
                                    );
                                    setJobPostingsTotalCount(
                                        data.totalCount || 0
                                    );

                                    // 마커별 조회인지 전체 조회인지 구분
                                    const isWorkspaceSpecific =
                                        data.cursor ===
                                            '' &&
                                        data.totalCount <=
                                            50;

                                    if (
                                        isWorkspaceSpecific
                                    ) {
                                        // 마커별 조회 모드
                                        setIsWorkspaceView(
                                            true
                                        );

                                        // 마커별 조회 시 리스트 펼치기
                                        if (
                                            data.data
                                                .length > 0
                                        ) {
                                            setListHeight(
                                                Math.min(
                                                    window.innerHeight *
                                                        0.8,
                                                    400
                                                )
                                            );
                                        }
                                    } else {
                                        // 전체 조회 모드
                                        setIsWorkspaceView(
                                            false
                                        );
                                    }
                                } else {
                                    setJobPostings(data);
                                }
                            }}
                            onMapMoved={() =>
                                setShowSearchButton(true)
                            }
                            onCurrentLocationStatusChange={(
                                isAtCurrent
                            ) =>
                                setIsAtCurrentLocation(
                                    isAtCurrent
                                )
                            }
                            onMapBackgroundClick={
                                handleMapBackgroundClick
                            }
                            onMarkerClick={
                                handleMarkerClick
                            }
                        />
                    </MapContainer>
                    <CurrentLocationButton
                        $listHeight={listHeight}
                        $isAtCurrentLocation={
                            isAtCurrentLocation
                        }
                        onClick={handleCurrentLocationClick}
                    >
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
                                fill={
                                    isAtCurrentLocation
                                        ? '#ffffff'
                                        : '#333'
                                }
                            />
                        </svg>
                    </CurrentLocationButton>
                </MapSection>
            )}

            {viewMode === 'list' ? (
                <ListSection>
                    <ListContainer>
                        <Controls>
                            <FilterButton
                                type='button'
                                onClick={() =>
                                    setIsFilterOpen(true)
                                }
                                aria-label='필터'
                            >
                                <img
                                    src={filterIcon}
                                    alt='필터'
                                />
                            </FilterButton>
                        </Controls>
                        <Divider />
                        <ListArea id='scrollableListArea'>
                            {listPostings.length === 0 &&
                            !listHasMore ? (
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
                                        listPostings.length
                                    }
                                    next={
                                        handleListLoadMore
                                    }
                                    hasMore={
                                        listHasMore &&
                                        listPostings.length <
                                            listTotalCount
                                    }
                                    loader={
                                        <CenteredDiv>
                                            <Loader />
                                        </CenteredDiv>
                                    }
                                    scrollableTarget='scrollableListArea'
                                >
                                    {listPostings.map(
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
            ) : (
                <JobListContainer
                    $height={listHeight}
                    $isDragging={isDragging}
                >
                    <DragHandle
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        <DragBar />
                    </DragHandle>
                    <JobListContent>
                        {isWorkspaceView ? (
                            // 마커별 조회 모드: 간단한 목록만 표시
                            <MarkerJobPostList
                                posts={jobPostings}
                                onSelect={handlePostSelect}
                                scrapMap={scrapMap}
                                onScrapChange={toggleScrap}
                            />
                        ) : (
                            // 전체 조회 모드: 검색, 필터링, 무한스크롤 포함
                            <JobPostList
                                posts={jobPostings}
                                cursor={jobPostingsCursor}
                                totalCount={
                                    jobPostingsTotalCount
                                }
                                onLoadMore={() => {
                                    if (
                                        mapRef.current &&
                                        mapRef.current
                                            .loadMoreJobPostings
                                    ) {
                                        mapRef.current.loadMoreJobPostings(
                                            jobPostingsCursor
                                        );
                                    }
                                }}
                                onSelect={handlePostSelect}
                                scrapMap={scrapMap}
                                onScrapChange={toggleScrap}
                                searchValue={searchInput}
                                onSearchInputChange={
                                    handleSearchInputChange
                                }
                                onSearchSubmit={
                                    handleSearchSubmit
                                }
                                sortValue={sortType}
                                onSortChange={
                                    handleSortChange
                                }
                            />
                        )}
                    </JobListContent>
                </JobListContainer>
            )}

            <ToggleButton
                $viewMode={viewMode}
                onClick={handleToggleView}
                aria-label={
                    viewMode === 'map'
                        ? '리스트 보기'
                        : '지도 보기'
                }
            >
                <img
                    src={
                        viewMode === 'map'
                            ? listIcon
                            : mapViewIcon
                    }
                    alt={
                        viewMode === 'map'
                            ? '리스트 보기'
                            : '지도 보기'
                    }
                />
            </ToggleButton>

            <BottomNavigation />

            {/* JobPostDetail 오버레이 */}
            {showDetailOverlay && selectedPostId && (
                <JobPostDetailOverlay
                    postId={selectedPostId}
                    onClose={handleCloseDetailOverlay}
                    onApply={handleApply}
                />
            )}

            {/* JobApply 오버레이 */}
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

export default JobLookupMap;

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

    /* Flutter 웹뷰에서는 safe-area-inset을 사용하지 않음 */
    /* 네이티브 앱에서 제공하는 화면 정보 사용 */
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;

    /* 모바일 웹뷰 최적화 */
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
    height: 100vh;
    height: 100dvh;
    overflow: hidden;

    /* Flutter 웹뷰에서는 전체 화면 사용 */
    @media (max-width: 480px) {
        height: 100vh;
        height: 100dvh;
    }

    @media (max-width: 360px) {
        height: 100vh;
        height: 100dvh;
    }
`;

const SearchButton = styled.button`
    position: absolute;
    top: ${() => {
        // Flutter 웹뷰에서 네이티브 화면 정보가 있으면 사용
        if (
            window.nativeScreenInfo &&
            window.nativeScreenInfo.statusBarHeight
        ) {
            return (
                window.nativeScreenInfo.statusBarHeight + 20
            );
        }
        return '20px';
    }};
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: auto;
    min-width: 200px;
    max-width: 300px;
    height: 40px;
    border: none;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 0 16px;

    &:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateX(-50%) translateY(1px);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
        top: 5%;
        height: 36px;
        min-width: 180px;
        max-width: 280px;
        padding: 0 14px;
    }

    @media (max-width: 360px) {
        top: 5%;
        height: 34px;
        min-width: 160px;
        max-width: 260px;
        padding: 0 12px;
    }

    @media (max-width: 320px) {
        top: 5%;
        height: 32px;
        min-width: 140px;
        max-width: 240px;
        padding: 0 10px;
    }
`;

const SearchIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;
    transition: color 0.2s ease;

    ${SearchButton}:hover & {
        color: #399982;
    }
`;

const SearchText = styled.span`
    font-family: 'Pretendard';
    font-size: 15px;
    font-weight: 500;
    color: #666666;
    transition: color 0.2s ease;
    white-space: nowrap;

    ${SearchButton}:hover & {
        color: #399982;
    }

    @media (max-width: 480px) {
        font-size: 14px;
    }

    @media (max-width: 360px) {
        font-size: 13px;
    }

    @media (max-width: 320px) {
        font-size: 12px;
    }
`;

const MapContainer = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
`;

const CurrentLocationButton = styled.button`
    position: absolute;
    bottom: 160px;
    right: 20px;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: ${(props) =>
        props.$isAtCurrentLocation ? '#399982' : '#ffffff'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background: ${(props) =>
            props.$isAtCurrentLocation
                ? '#399982'
                : '#f0f0f0'};

        svg path {
            fill: ${(props) =>
                props.$isAtCurrentLocation
                    ? '#ffffff'
                    : '#333'};
        }
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 480px) {
        width: 44px;
        height: 44px;
        bottom: 150px;
        right: 16px;
    }

    @media (max-width: 360px) {
        width: 40px;
        height: 40px;
        bottom: 150px;
        right: 12px;
    }

    @media (max-width: 320px) {
        width: 38px;
        height: 38px;
        bottom: 150px;
        right: 10px;
    }
`;

const ListSection = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const JobListContainer = styled.div`
    position: fixed;
    bottom: ${() => {
        // Flutter 웹뷰에서 네이티브 화면 정보가 있으면 사용
        if (
            window.nativeScreenInfo &&
            window.nativeScreenInfo.bottomPadding
        ) {
            return (
                window.nativeScreenInfo.bottomPadding + 70
            );
        }
        return '50px';
    }};
    left: 0;
    right: 0;
    height: ${(props) => Math.max(40, props.$height)}px;
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    z-index: 20;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    transition: ${(props) =>
        props.$isDragging
            ? 'none'
            : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'};

    @media (max-width: 480px) {
        bottom: 50px;
        border-radius: 16px 16px 0 0;
    }

    @media (max-width: 360px) {
        bottom: 40px;
        border-radius: 12px 12px 0 0;
    }
`;

const ToggleButton = styled.button`
    position: absolute;
    bottom: 100px;
    right: 20px;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: ${(props) =>
        props.$viewMode === 'list' ? '#399982' : '#ffffff'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    padding: 0;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background: ${(props) =>
            props.$viewMode === 'list'
                ? '#399982'
                : '#ffffff'};
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    img {
        width: 20px;
        height: 20px;
        filter: ${(props) =>
            props.$viewMode === 'list'
                ? 'brightness(0) invert(1)'
                : 'brightness(0)'};
    }

    @media (max-width: 768px) {
        bottom: 100px;
        right: 20px;
        width: 48px;
        height: 48px;
    }

    @media (max-width: 480px) {
        width: 44px;
        height: 44px;
        bottom: 100px;
        right: 16px;
    }

    @media (max-width: 360px) {
        width: 40px;
        height: 40px;
        bottom: 100px;
        right: 12px;
    }

    @media (max-width: 320px) {
        width: 38px;
        height: 38px;
        bottom: 100px;
        right: 10px;
    }

    @supports (padding: max(0px)) {
        bottom: max(
            100px,
            calc(100px + env(safe-area-inset-bottom))
        );

        @media (max-width: 768px) {
            bottom: max(
                100px,
                calc(100px + env(safe-area-inset-bottom))
            );
        }
    }
`;

const DragHandle = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
    position: relative;

    &:active {
        cursor: grabbing;
        background: #f8f9fa;
    }

    @media (max-width: 480px) {
        height: 35px;
    }

    @media (max-width: 360px) {
        height: 30px;
    }
`;

const DragBar = styled.div`
    width: 50px;
    height: 5px;
    background: #c0c0c0;
    border-radius: 3px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    ${DragHandle}:hover & {
        background: #999999;
        transform: scale(1.1);
    }

    @media (max-width: 480px) {
        width: 45px;
        height: 4px;
    }

    @media (max-width: 360px) {
        width: 40px;
        height: 4px;
    }
`;

const JobListContent = styled.div`
    height: calc(100% - 40px);
    overflow: hidden;
    background: #ffffff;

    @media (max-width: 480px) {
        height: calc(100% - 35px);
    }

    @media (max-width: 360px) {
        height: calc(100% - 30px);
    }
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
    padding-bottom: 80px;

    @media (max-width: 480px) {
        padding-bottom: 80px;
    }

    @media (max-width: 360px) {
        padding-bottom: 70px;
    }

    @supports (padding: max(0px)) {
        padding-bottom: max(
            80px,
            calc(80px + env(safe-area-inset-bottom))
        );

        @media (max-width: 360px) {
            padding-bottom: max(
                70px,
                calc(70px + env(safe-area-inset-bottom))
            );
        }
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
