import { useEffect, useRef, useState } from 'react';
import marker from '../../../assets/icons/marker.svg';
import styled from 'styled-components';

const NAVER_MAP_CLIENT_ID = import.meta.env
    .VITE_NAVER_MAP_CLIENT_ID;

const WorkplaceMap = ({
    latitude,
    longitude,
    businessName,
}) => {
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

    // 백엔드에서 넘어오는 위도/경도를 숫자로 변환하고 유효성 검사
    const validLatitude = parseFloat(latitude);
    const validLongitude = parseFloat(longitude);

    // 유효한 좌표인지 확인 (한국 범위 내)
    const isValidCoordinate =
        !isNaN(validLatitude) &&
        !isNaN(validLongitude) &&
        validLatitude >= 33 &&
        validLatitude <= 39 && // 한국 위도 범위
        validLongitude >= 124 &&
        validLongitude <= 132; // 한국 경도 범위

    useEffect(() => {
        if (!mapRef.current || !isValidCoordinate) return;

        const initializeMap = () => {
            if (
                !window.naver ||
                !window.naver.maps ||
                !mapRef.current
            )
                return;

            console.log('업장 지도 초기화 중...', {
                latitude: validLatitude,
                longitude: validLongitude,
                businessName,
            });

            const map = new window.naver.maps.Map(
                mapRef.current,
                {
                    center: new window.naver.maps.LatLng(
                        validLatitude,
                        validLongitude
                    ),
                    zoom: 16,
                    draggable: false,
                    scrollWheel: false,
                    disableDoubleClickZoom: true,
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

            // 업장 마커 생성
            const markerObj = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(
                    validLatitude,
                    validLongitude
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

            // 지도 클릭 시 네이버 지도로 이동
            window.naver.maps.Event.addListener(
                map,
                'click',
                () => {
                    const url = `https://map.naver.com/v5/search/${businessName}`;
                    window.open(url, '_blank');
                }
            );

            // 마커 클릭 시에도 네이버 지도로 이동
            window.naver.maps.Event.addListener(
                markerObj,
                'click',
                () => {
                    const url = `https://map.naver.com/v5/search/${businessName}`;
                    window.open(url, '_blank');
                }
            );
        };

        // 중복 스크립트 추가 방지
        if (document.getElementById('naver-map-script')) {
            if (window.naver && window.naver.maps) {
                initializeMap();
            } else {
                // 스크립트는 로드되었지만 아직 초기화되지 않은 경우
                const checkNaver = setInterval(() => {
                    if (window.naver && window.naver.maps) {
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
            console.error('네이버 지도 스크립트 로드 실패');
        };
        document.body.appendChild(script);
    }, [
        validLatitude,
        validLongitude,
        businessName,
        isValidCoordinate,
    ]);

    // 유효하지 않은 좌표인 경우 에러 메시지 표시
    if (!isValidCoordinate) {
        return (
            <MapContainer>
                <ErrorMessage>
                    유효하지 않은 위치 정보입니다.
                    <br />
                    위도: {latitude}, 경도: {longitude}
                </ErrorMessage>
            </MapContainer>
        );
    }

    return (
        <MapContainer
            ref={mapRef}
            $isMapLoaded={isMapLoaded}
        >
            {!isMapLoaded && (
                <LoadingMessage>
                    지도를 불러오는 중...
                </LoadingMessage>
            )}
        </MapContainer>
    );
};

export default WorkplaceMap;

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    cursor: pointer;
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

    /* 클릭 시 커서 유지 */
    &:active {
        cursor: pointer;
    }

    /* 모바일 웹뷰 최적화 */
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-x pan-y;
`;

const LoadingMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    font-size: 14px;
    z-index: 1;
    font-family: 'Pretendard';
    font-weight: 400;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ff4444;
    font-size: 14px;
    z-index: 1;
    font-family: 'Pretendard';
    font-weight: 400;
    background: rgba(255, 255, 255, 0.9);
    padding: 12px 20px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    line-height: 1.4;
`;
