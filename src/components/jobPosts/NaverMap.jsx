import { useEffect, useRef } from "react";

const NAVER_MAP_CLIENT_ID = import.meta.env
    .VITE_NAVER_MAP_CLIENT_ID;

function NaverMap() {
    const mapRef = useRef(null);

    useEffect(() => {
        // 이미 스크립트가 있으면 중복 추가 방지
        if (document.getElementById("naver-map-script")) {
            if (window.naver && window.naver.maps) {
                new window.naver.maps.Map(mapRef.current);
            }
            return;
        }

        // 네이버 지도 API 스크립트 동적 추가
        const script = document.createElement("script");
        script.id = "naver-map-script";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
        script.async = true;
        script.onload = () => {
            new window.naver.maps.Map(mapRef.current);
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
        />
    );
}

export default NaverMap;
