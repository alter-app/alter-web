import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NaverMap from '../../components/owner/NaverMap';
import JobPostList from '../../components/user/jobPosts/JobPostList';
import MarkerJobPostList from '../../components/user/jobPosts/MarkerJobPostList';
import JobPostDetailOverlay from '../../components/user/jobPosts/JobPostDetailOverlay';
import JobApplyOverlay from '../../components/user/jobPosts/JobApplyOverlay';
import BottomNavigation from '../../layouts/BottomNavigation';

const JobLookupMap = () => {
    const navigate = useNavigate();
    const [listHeight, setListHeight] = useState(40);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);
    const [scrapMap, setScrapMap] = useState({});
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

    const handleSearchClick = () => {
        if (
            mapRef.current &&
            mapRef.current.refreshMarkers
        ) {
            // 검색 버튼 숨기기
            setShowSearchButton(false);
            // 마커와 공고 리스트 로드 (콜백으로 자동 업데이트)
            mapRef.current.refreshMarkers();
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

    const handleScrapChange = (id, value) => {
        setScrapMap((prev) => ({ ...prev, [id]: value }));
    };

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
                        onJobPostingsUpdate={(data) => {
                            if (
                                typeof data === 'object' &&
                                data.data
                            ) {
                                setJobPostings(data.data);
                                setJobPostingsCursor(
                                    data.cursor || ''
                                );
                                setJobPostingsTotalCount(
                                    data.totalCount || 0
                                );

                                // 마커별 조회인지 전체 조회인지 구분
                                const isWorkspaceSpecific =
                                    data.cursor === '' &&
                                    data.totalCount <= 50;

                                if (isWorkspaceSpecific) {
                                    // 마커별 조회 모드
                                    setIsWorkspaceView(
                                        true
                                    );

                                    // 마커별 조회 시 리스트 펼치기
                                    if (
                                        data.data.length > 0
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
                        onMarkerClick={handleMarkerClick}
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
                            onScrapChange={
                                handleScrapChange
                            }
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
                            onScrapChange={
                                handleScrapChange
                            }
                        />
                    )}
                </JobListContent>
            </JobListContainer>

            <BottomNavigation />

            {/* JobPostDetail 오버레이 */}
            {showDetailOverlay && selectedPostId && (
                <JobPostDetailOverlay
                    postId={selectedPostId}
                    onClose={handleCloseDetailOverlay}
                    onApply={handleApply}
                    scrapMap={scrapMap}
                    onScrapChange={handleScrapChange}
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
    bottom: ${(props) => {
        // 리스트가 접혔을 때(작을 때)만 리스트 위에, 그 외에는 고정 위치
        if (props.$listHeight < 100) {
            return Math.max(140, props.$listHeight + 20);
        }
        // 리스트가 펼쳐져 있을 때는 고정 위치
        return 140;
    }}px;
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
        bottom: ${(props) => {
            // 리스트가 접혔을 때만 리스트 위에, 그 외에는 고정 위치
            if (props.$listHeight < 100) {
                return Math.max(
                    160,
                    props.$listHeight + 16
                );
            }
            // 리스트가 펼쳐져 있을 때는 고정 위치 (더 높게)
            return 160;
        }}px;
        right: 16px;
    }

    @media (max-width: 360px) {
        width: 40px;
        height: 40px;
        bottom: ${(props) => {
            // 리스트가 접혔을 때만 리스트 위에, 그 외에는 고정 위치
            if (props.$listHeight < 100) {
                return Math.max(
                    150,
                    props.$listHeight + 12
                );
            }
            // 리스트가 펼쳐져 있을 때는 고정 위치 (더 높게)
            return 150;
        }}px;
        right: 12px;
    }

    @media (max-width: 320px) {
        width: 38px;
        height: 38px;
        bottom: ${(props) => {
            // 리스트가 접혔을 때만 리스트 위에, 그 외에는 고정 위치
            if (props.$listHeight < 100) {
                return Math.max(
                    140,
                    props.$listHeight + 10
                );
            }
            // 리스트가 펼쳐져 있을 때는 고정 위치 (더 높게)
            return 140;
        }}px;
        right: 10px;
    }
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
