import { useEffect, useRef } from 'react';
import marker from '../../assets/icons/marker.svg';
import styled from 'styled-components';

const NAVER_MAP_CLIENT_ID = import.meta.env
    .VITE_NAVER_MAP_CLIENT_ID;

function NaverMap({ latitude, longitude, businessName }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (latitude == null || longitude == null) return;

        // 중복 스크립트 추가 방지
        if (document.getElementById('naver-map-script')) {
            if (window.naver && window.naver.maps) {
                const map = new window.naver.maps.Map(
                    mapRef.current,
                    {
                        center: new window.naver.maps.LatLng(
                            latitude,
                            longitude
                        ),
                        zoom: 16,
                        draggable: false,
                        scrollWheel: false,
                        disableDoubleClickZoom: true,
                    }
                );

                const markerObj =
                    new window.naver.maps.Marker({
                        position:
                            new window.naver.maps.LatLng(
                                latitude,
                                longitude
                            ),
                        map,
                        icon: {
                            content: `
                            <img src="${marker}" style="width:50px;height:50px;" />
                        `,
                            anchor: new window.naver.maps.Point(
                                20,
                                40
                            ),
                        },
                    });

                window.naver.maps.Event.addListener(
                    map,
                    'click',
                    () => {
                        const url = `https://map.naver.com/v5/search/${businessName}`;
                        window.open(url, '_blank');
                    }
                );

                window.naver.maps.Event.addListener(
                    markerObj,
                    'click',
                    () => {
                        const url = `https://map.naver.com/v5/search/${businessName}`;
                        window.open(url, '_blank');
                    }
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
            const map = new window.naver.maps.Map(
                mapRef.current,
                {
                    center: new window.naver.maps.LatLng(
                        latitude,
                        longitude
                    ),
                    zoom: 16,
                    draggable: false,
                    scrollWheel: false,
                    disableDoubleClickZoom: true,
                }
            );

            const markerObj = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(
                    latitude,
                    longitude
                ),
                map,
                icon: {
                    content: `
                        <img src="${marker}" style="width:50px;height:50px;" />
                    `,
                    anchor: new window.naver.maps.Point(
                        20,
                        40
                    ),
                },
            });

            window.naver.maps.Event.addListener(
                map,
                'click',
                () => {
                    const url = `https://map.naver.com/v5/search/${businessName}`;
                    window.open(url, '_blank');
                }
            );

            window.naver.maps.Event.addListener(
                markerObj,
                'click',
                () => {
                    const url = `https://map.naver.com/v5/search/${businessName}`;
                    window.open(url, '_blank');
                }
            );
        };
        document.body.appendChild(script);
    }, [latitude, longitude, businessName]);

    return <MapContainer ref={mapRef} />;
}

export default NaverMap;

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: solid 1px #767676;
    cursor: pointer;
`;
