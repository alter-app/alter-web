import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';
import marker from '../../assets/icons/marker.svg';
import styled from 'styled-components';
import {
    getMapMarkers,
    getMapJobPostings,
    getWorkspacePostings,
} from '../../services/workplaceService';

const NAVER_MAP_CLIENT_ID = import.meta.env
    .VITE_NAVER_MAP_CLIENT_ID;

const NaverMap = forwardRef(
    (
        {
            latitude,
            longitude,
            businessName,
            onJobPostingsUpdate,
            onMapMoved,
            onCurrentLocationStatusChange,
        },
        ref
    ) => {
        const mapRef = useRef(null);
        const [currentLocation, setCurrentLocation] =
            useState(() => {
                // localStorage에서 저장된 위치 정보 확인
                const savedLocation =
                    localStorage.getItem('userLocation');
                if (savedLocation) {
                    try {
                        const parsed =
                            JSON.parse(savedLocation);
                        const now = Date.now();
                        const fiveMinutes = 5 * 60 * 1000; // 5분

                        // 저장된 위치가 5분 이내인지 확인
                        if (
                            parsed.timestamp &&
                            now - parsed.timestamp <
                                fiveMinutes
                        ) {
                            console.log(
                                '저장된 위치 정보 사용 (유효함):',
                                parsed
                            );
                            return {
                                latitude: parsed.latitude,
                                longitude: parsed.longitude,
                            };
                        } else {
                            console.log(
                                '저장된 위치 정보가 만료됨'
                            );
                            localStorage.removeItem(
                                'userLocation'
                            );
                        }
                    } catch (e) {
                        console.log(
                            '저장된 위치 정보 파싱 실패'
                        );
                        localStorage.removeItem(
                            'userLocation'
                        );
                    }
                }
                return {
                    latitude: latitude || 37.5665,
                    longitude: longitude || 126.978,
                };
            });
        const [locationPermission, setLocationPermission] =
            useState('requesting');
        const [markers, setMarkers] = useState([]);
        const [mapInstance, setMapInstance] =
            useState(null);
        const [jobPostings, setJobPostings] = useState([]);
        const [jobPostingsCursor, setJobPostingsCursor] =
            useState('');
        const [
            jobPostingsTotalCount,
            setJobPostingsTotalCount,
        ] = useState(0);
        const [isMapLoaded, setIsMapLoaded] =
            useState(false);
        const [hasSearched, setHasSearched] =
            useState(false);
        const hasSearchedRef = useRef(false);
        const [
            isAtCurrentLocation,
            setIsAtCurrentLocation,
        ] = useState(true);

        // hasSearched 상태 변경 시 ref도 업데이트
        useEffect(() => {
            hasSearchedRef.current = hasSearched;
        }, [hasSearched]);

        // 현재 위치 상태 변경 시 부모 컴포넌트에 알림
        useEffect(() => {
            if (onCurrentLocationStatusChange) {
                onCurrentLocationStatusChange(
                    isAtCurrentLocation
                );
            }
        }, [
            isAtCurrentLocation,
            onCurrentLocationStatusChange,
        ]);

        // 지도 영역의 공고 리스트 로드
        const loadJobPostingsInBounds = async (map) => {
            try {
                const bounds = map.getBounds();
                const sw = bounds.getSW(); // 남서쪽 모서리
                const ne = bounds.getNE(); // 북동쪽 모서리

                const coordinate1 = {
                    latitude: sw.lat(),
                    longitude: sw.lng(),
                };
                const coordinate2 = {
                    latitude: ne.lat(),
                    longitude: ne.lng(),
                };

                console.log('공고 리스트 로드 요청:', {
                    coordinate1,
                    coordinate2,
                });

                const response = await getMapJobPostings(
                    coordinate1,
                    coordinate2,
                    '', // cursorInfo
                    10 // pageSize - 무한스크롤을 위해 적은 수로 시작
                );
                console.log('공고 리스트 응답:', response);

                if (
                    response.data &&
                    Array.isArray(response.data)
                ) {
                    setJobPostings(response.data);
                    setJobPostingsCursor(
                        response.page.cursor || ''
                    );
                    setJobPostingsTotalCount(
                        response.page.totalCount || 0
                    );
                    // 외부 컴포넌트에 공고 리스트 업데이트 알림 (렌더링 완료 후)
                    if (onJobPostingsUpdate) {
                        setTimeout(() => {
                            onJobPostingsUpdate({
                                data: response.data,
                                cursor:
                                    response.page.cursor ||
                                    '',
                                totalCount:
                                    response.page
                                        .totalCount || 0,
                            });
                        }, 0);
                    }
                }
            } catch (error) {
                console.error(
                    '공고 리스트 로드 실패:',
                    error
                );
            }
        };

        // 특정 업장의 공고 조회 함수
        const loadWorkspacePostings = async (
            workspaceId
        ) => {
            try {
                console.log(
                    '업장 공고 조회 요청:',
                    workspaceId
                );

                const response = await getWorkspacePostings(
                    workspaceId
                );
                console.log('업장 공고 응답:', response);

                if (
                    response.data &&
                    Array.isArray(response.data)
                ) {
                    setJobPostings(response.data);
                    setJobPostingsCursor('');
                    setJobPostingsTotalCount(
                        response.data.length
                    );

                    // 외부 컴포넌트에 공고 리스트 업데이트 알림
                    if (onJobPostingsUpdate) {
                        setTimeout(() => {
                            onJobPostingsUpdate({
                                data: response.data,
                                cursor: '',
                                totalCount:
                                    response.data.length,
                            });
                        }, 0);
                    }
                }
            } catch (error) {
                console.error(
                    '업장 공고 조회 실패:',
                    error
                );
            }
        };

        // 추가 데이터 로드 함수
        const loadMoreJobPostings = async (cursor) => {
            if (mapInstance) {
                try {
                    // 전달받은 cursor 사용, 없으면 현재 상태 사용
                    const currentCursor =
                        cursor || jobPostingsCursor;
                    if (!currentCursor) {
                        console.log(
                            '더 이상 로드할 데이터가 없습니다.'
                        );
                        // hasMore를 false로 설정하기 위해 빈 cursor로 콜백 호출 (렌더링 완료 후)
                        if (onJobPostingsUpdate) {
                            setTimeout(() => {
                                onJobPostingsUpdate({
                                    data: jobPostings,
                                    cursor: '',
                                    totalCount:
                                        jobPostingsTotalCount,
                                });
                            }, 0);
                        }
                        return;
                    }

                    const bounds = mapInstance.getBounds();
                    const sw = bounds.getSW();
                    const ne = bounds.getNE();

                    const coordinate1 = {
                        latitude: sw.lat(),
                        longitude: sw.lng(),
                    };
                    const coordinate2 = {
                        latitude: ne.lat(),
                        longitude: ne.lng(),
                    };

                    console.log('추가 데이터 로드 요청:', {
                        coordinate1,
                        coordinate2,
                        cursor: currentCursor,
                    });

                    const response =
                        await getMapJobPostings(
                            coordinate1,
                            coordinate2,
                            currentCursor,
                            10
                        );

                    console.log(
                        '추가 데이터 로드 응답:',
                        response
                    );

                    if (
                        response.data &&
                        Array.isArray(response.data)
                    ) {
                        // 상태 업데이트
                        setJobPostings((prev) => {
                            const newData = [
                                ...prev,
                                ...response.data,
                            ];

                            // 렌더링 완료 후 콜백 호출
                            if (onJobPostingsUpdate) {
                                setTimeout(() => {
                                    onJobPostingsUpdate({
                                        data: newData,
                                        cursor:
                                            response.page
                                                .cursor ||
                                            '',
                                        totalCount:
                                            response.page
                                                .totalCount ||
                                            0,
                                    });
                                }, 0);
                            }

                            return newData;
                        });

                        setJobPostingsCursor(
                            response.page.cursor || ''
                        );
                        setJobPostingsTotalCount(
                            response.page.totalCount || 0
                        );
                    }
                } catch (error) {
                    console.error(
                        '추가 공고 리스트 로드 실패:',
                        error
                    );
                }
            }
        };

        // ref를 통해 외부에서 호출할 수 있는 함수들 노출
        useImperativeHandle(ref, () => ({
            refreshMarkers: () => {
                if (mapInstance) {
                    // 검색 실행 표시
                    setHasSearched(true);
                    hasSearchedRef.current = true;
                    // 현재 화면 영역의 마커와 공고 리스트 로드
                    loadMarkersInBounds(mapInstance);
                    loadJobPostingsInBounds(mapInstance);
                }
            },
            loadMoreJobPostings,
            loadWorkspacePostings,
            getJobPostings: () => ({
                data: jobPostings,
                cursor: jobPostingsCursor,
                totalCount: jobPostingsTotalCount,
            }),
            goToCurrentLocation: () => {
                if (mapInstance) {
                    // 현재 위치로 지도 이동만 (마커/리스트 조회 없음)
                    const center =
                        new window.naver.maps.LatLng(
                            currentLocation.latitude,
                            currentLocation.longitude
                        );
                    mapInstance.setCenter(center);
                    mapInstance.setZoom(16);

                    // 현재 위치 버튼 클릭 시에는 즉시 상태 변경
                    setIsAtCurrentLocation(true);
                }
            },
        }));

        // 지도 영역의 마커 로드
        const loadMarkersInBounds = async (map) => {
            try {
                const bounds = map.getBounds();
                const sw = bounds.getSW(); // 남서쪽 모서리
                const ne = bounds.getNE(); // 북동쪽 모서리

                const coordinate1 = {
                    latitude: sw.lat(),
                    longitude: sw.lng(),
                };
                const coordinate2 = {
                    latitude: ne.lat(),
                    longitude: ne.lng(),
                };

                console.log('마커 로드 요청:', {
                    coordinate1,
                    coordinate2,
                });

                const response = await getMapMarkers(
                    coordinate1,
                    coordinate2
                );
                console.log('마커 응답:', response);

                if (
                    response.data &&
                    Array.isArray(response.data)
                ) {
                    setMarkers(response.data);
                }
            } catch (error) {
                console.error('마커 로드 실패:', error);
            }
        };

        // 현재 위치 가져오기
        useEffect(() => {
            // 이미 유효한 위치 정보가 있으면 GPS 요청하지 않음
            const savedLocation =
                localStorage.getItem('userLocation');
            if (savedLocation) {
                try {
                    const parsed =
                        JSON.parse(savedLocation);
                    const now = Date.now();
                    const fiveMinutes = 5 * 60 * 1000;

                    if (
                        parsed.timestamp &&
                        now - parsed.timestamp < fiveMinutes
                    ) {
                        console.log(
                            '저장된 위치 정보가 유효하므로 GPS 요청 생략'
                        );
                        setLocationPermission('granted');
                        return;
                    }
                } catch (e) {
                    console.log(
                        '저장된 위치 정보 확인 실패'
                    );
                }
            }

            console.log('위치 정보 요청 시작...');

            if (!navigator.geolocation) {
                console.log(
                    'Geolocation API를 지원하지 않습니다.'
                );
                setLocationPermission('unavailable');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('위치 정보 획득 성공:', {
                        latitude: position.coords.latitude,
                        longitude:
                            position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    });
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude:
                            position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    setLocationPermission('granted');

                    // 위치 정보를 localStorage에 저장 (5분간 유효)
                    const locationData = {
                        ...newLocation,
                        timestamp: Date.now(),
                        accuracy: position.coords.accuracy,
                    };
                    localStorage.setItem(
                        'userLocation',
                        JSON.stringify(locationData)
                    );
                    console.log(
                        '위치 정보 저장됨:',
                        locationData
                    );
                },
                (error) => {
                    console.log(
                        '위치 정보를 가져올 수 없습니다:',
                        {
                            code: error.code,
                            message: error.message,
                        }
                    );

                    // 에러 코드별 상세 메시지
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.log(
                                '위치 권한이 거부되었습니다.'
                            );
                            setLocationPermission('denied');
                            alert(
                                '위치 권한이 필요합니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
                            );
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.log(
                                '위치 정보를 사용할 수 없습니다.'
                            );
                            setLocationPermission(
                                'unavailable'
                            );
                            break;
                        case error.TIMEOUT:
                            console.log(
                                '위치 요청 시간이 초과되었습니다.'
                            );
                            setLocationPermission(
                                'timeout'
                            );
                            break;
                        default:
                            console.log(
                                '알 수 없는 오류가 발생했습니다.'
                            );
                            setLocationPermission('error');
                            break;
                    }
                    // 기본값 유지 (서울시청)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // 15초로 증가
                    maximumAge: 0, // 캐시 사용 안함
                }
            );
        }, []);

        useEffect(() => {
            if (
                !mapRef.current ||
                locationPermission === 'requesting'
            )
                return;

            const initializeMap = () => {
                if (
                    !window.naver ||
                    !window.naver.maps ||
                    !mapRef.current
                )
                    return;

                console.log('지도 초기화 중...', {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                });

                const map = new window.naver.maps.Map(
                    mapRef.current,
                    {
                        center: new window.naver.maps.LatLng(
                            currentLocation.latitude,
                            currentLocation.longitude
                        ),
                        zoom: 16,
                        draggable: true,
                        scrollWheel: true,
                        disableDoubleClickZoom: false,
                        logoControl: false,
                        mapDataControl: false,
                        scaleControl: false,
                        mapTypeControl: false,
                        zoomControl: false,
                    }
                );

                // 지도 인스턴스 저장
                setMapInstance(map);

                // 지도 로드 완료 표시
                setIsMapLoaded(true);

                // 초기 마커와 공고 리스트 로드
                setTimeout(() => {
                    loadMarkersInBounds(map);
                    loadJobPostingsInBounds(map);
                    setHasSearched(true); // 초기 로딩 완료 후 검색 상태로 설정
                    hasSearchedRef.current = true; // ref도 동시에 업데이트
                    // 초기 상태는 현재 위치로 설정 (true)
                    setIsAtCurrentLocation(true);
                }, 500); // 지도 완전 로드 후 500ms 대기

                // 지도 이동 이벤트 리스너 추가 (검색 버튼 표시 및 현재 위치 상태 체크)
                window.naver.maps.Event.addListener(
                    map,
                    'bounds_changed',
                    () => {
                        // 검색을 한 번이라도 했으면 지도 이동 시 검색 버튼 표시
                        if (hasSearchedRef.current) {
                            // 외부 컴포넌트에 지도 이동 알림 (검색 버튼 표시)
                            if (onMapMoved) {
                                onMapMoved();
                            }
                        }
                    }
                );

                // 초기 마커 로드 제거 (검색 버튼으로만 마커 로드)
                // loadMarkersInBounds(map);

                const markerObj =
                    new window.naver.maps.Marker({
                        position:
                            new window.naver.maps.LatLng(
                                currentLocation.latitude,
                                currentLocation.longitude
                            ),
                        map,
                        icon: {
                            content: `
                    <img src="${marker}" style="width:50px;height:50px;z-index:1;" />
                `,
                            anchor: new window.naver.maps.Point(
                                20,
                                40
                            ),
                        },
                        zIndex: 1,
                    });

                // 마커 클릭 시에만 네이버 지도로 이동
                window.naver.maps.Event.addListener(
                    markerObj,
                    'click',
                    () => {
                        const url = `https://map.naver.com/v5/search/${businessName}`;
                        window.open(url, '_blank');
                    }
                );

                // 현재 위치 버튼 전용 이벤트 리스너 통합 관리
                const locationEventListeners = [];

                const handleLocationStateChange = () => {
                    setIsAtCurrentLocation(false);
                };

                // 통합된 이벤트 리스너 등록 및 관리
                const addLocationEventListeners = () => {
                    const locationEvents = [
                        'dragend',
                        'zoom_changed',
                        'center_changed',
                    ];

                    locationEvents.forEach((eventType) => {
                        const listener =
                            window.naver.maps.Event.addListener(
                                map,
                                eventType,
                                handleLocationStateChange
                            );
                        locationEventListeners.push(
                            listener
                        );
                    });
                };

                // 이벤트 리스너 등록
                addLocationEventListeners();
            };

            // 중복 스크립트 추가 방지
            if (
                document.getElementById('naver-map-script')
            ) {
                if (window.naver && window.naver.maps) {
                    initializeMap();
                } else {
                    // 스크립트는 로드되었지만 아직 초기화되지 않은 경우
                    const checkNaver = setInterval(() => {
                        if (
                            window.naver &&
                            window.naver.maps
                        ) {
                            clearInterval(checkNaver);
                            initializeMap();
                        }
                    }, 100);

                    // 5초 후 타임아웃
                    setTimeout(
                        () => clearInterval(checkNaver),
                        5000
                    );
                }
                return;
            }

            // 스크립트 없으면 새로 추가
            const script = document.createElement('script');
            script.id = 'naver-map-script';
            script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
            script.async = true;
            script.onload = () => {
                // 스크립트 로드 후 약간의 지연을 두고 지도 초기화
                setTimeout(() => {
                    initializeMap();
                }, 100);
            };
            script.onerror = () => {
                console.error(
                    '네이버 지도 스크립트 로드 실패'
                );
            };
            document.body.appendChild(script);
        }, [
            currentLocation,
            businessName,
            locationPermission,
        ]);

        // 마커 렌더링
        useEffect(() => {
            if (!mapInstance) return;

            // 기존 워크스페이스 마커들 제거 (현재 위치 마커는 유지)
            const existingMarkers =
                document.querySelectorAll(
                    '.workspace-marker'
                );
            existingMarkers.forEach((marker) =>
                marker.remove()
            );

            // 마커가 없으면 여기서 종료
            if (!markers.length) {
                console.log('표시할 마커가 없습니다.');
                return;
            }

            // 새로운 마커들 생성
            markers.forEach((markerData) => {
                const marker = new window.naver.maps.Marker(
                    {
                        position:
                            new window.naver.maps.LatLng(
                                markerData.latitude,
                                markerData.longitude
                            ),
                        map: mapInstance,
                        icon: {
                            content: `
                         <div class="workspace-marker" style="
                             width: 30px;
                             height: 30px;
                             background: #2DE283;
                             border: 2px solid #ffffff;
                             border-radius: 50%;
                             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                             cursor: pointer;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                         ">
                             <div style="
                                 width: 12px;
                                 height: 12px;
                                 background: #ffffff;
                                 border-radius: 50%;
                             "></div>
                         </div>
                     `,
                            anchor: new window.naver.maps.Point(
                                15,
                                15
                            ),
                        },
                        zIndex: 2,
                    }
                );

                // 마커 클릭 이벤트
                window.naver.maps.Event.addListener(
                    marker,
                    'click',
                    () => {
                        console.log(
                            '마커 클릭:',
                            markerData
                        );
                        // 해당 업장의 공고만 조회
                        if (markerData.workspaceId) {
                            loadWorkspacePostings(
                                markerData.workspaceId
                            );
                        }
                    }
                );
            });

            console.log(
                `${markers.length}개의 마커가 표시되었습니다.`
            );
        }, [mapInstance, markers]);

        return (
            <MapContainer
                ref={mapRef}
                $isMapLoaded={isMapLoaded}
            >
                {locationPermission === 'requesting' && (
                    <LocationMessage>
                        위치 정보를 가져오는 중...
                    </LocationMessage>
                )}
                {locationPermission === 'denied' && (
                    <LocationMessage>
                        위치 권한이 거부되었습니다.
                        서울시청이 표시됩니다.
                    </LocationMessage>
                )}
            </MapContainer>
        );
    }
);

NaverMap.displayName = 'NaverMap';

export default NaverMap;

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    cursor: grab;
    background: #f5f5f5;
    position: relative;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    z-index: 1;

    /* 지도가 로드되기 전까지 표시할 배경 */
    &::before {
        content: '지도를 불러오는 중...';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
        font-size: 14px;
        z-index: 1;
        font-family: 'Pretendard';
        font-weight: 400;
        display: ${(props) =>
            props.$isMapLoaded ? 'none' : 'block'};
        background: rgba(255, 255, 255, 0.9);
        padding: 8px 16px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* 지도 드래그 중 커서 변경 */
    &:active {
        cursor: grabbing;
    }

    /* 모바일 웹뷰 최적화 */
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-x pan-y;
`;

const LocationMessage = styled.div`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    @media (max-width: 480px) {
        font-size: 13px;
        padding: 6px 12px;
        top: 16px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        padding: 5px 10px;
        top: 12px;
    }
`;
