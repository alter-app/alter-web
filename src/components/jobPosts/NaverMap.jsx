import { useEffect, useRef, useState } from "react";
import marker from "../../assets/icons/marker.svg";

const NAVER_MAP_CLIENT_ID = import.meta.env
    .VITE_NAVER_MAP_CLIENT_ID;

function NaverMap() {
    const mapRef = useRef(null);
    const [myLocation, setMyLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMyLocation({
                        latitude: position.coords.latitude,
                        longitude:
                            position.coords.longitude,
                    });
                }
            );
        } else {
            alert("현재 위치를 알 수 없습니다.");
        }
    }, []);

    useEffect(() => {
        if (!myLocation) return;

        // 이미 스크립트가 있으면 중복 추가 방지
        if (document.getElementById("naver-map-script")) {
            if (window.naver && window.naver.maps) {
                const map = new window.naver.maps.Map(
                    mapRef.current,
                    {
                        center: new window.naver.maps.LatLng(
                            myLocation.latitude,
                            myLocation.longitude
                        ),
                        zoom: 15,
                    }
                );

                // SVG 경로로 커스텀 마커 추가
                new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(
                        myLocation.latitude,
                        myLocation.longitude
                    ),
                    map,
                    icon: {
                        content: `
                            <img src="${marker}" style="width:70px;height:70px;" />
                        `,
                        anchor: new window.naver.maps.Point(
                            20,
                            40
                        ),
                    },
                });
            }
            return;
        }

        // 네이버 지도 API 스크립트 동적 추가
        const script = document.createElement("script");
        script.id = "naver-map-script";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
        script.async = true;
        script.onload = () => {
            const map = new window.naver.maps.Map(
                mapRef.current,
                {
                    center: new window.naver.maps.LatLng(
                        myLocation.latitude,
                        myLocation.longitude
                    ),
                    zoom: 15,
                }
            );

            // SVG 경로로 커스텀 마커 추가
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(
                    myLocation.latitude,
                    myLocation.longitude
                ),
                map,
                icon: {
                    content: `
                        <img src="${marker}" style="width:70px;height:70px;" />
                    `,
                    anchor: new window.naver.maps.Point(
                        20,
                        40
                    ),
                },
            });
        };
        document.body.appendChild(script);
    }, [myLocation, marker]);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
        />
    );
}

export default NaverMap;
