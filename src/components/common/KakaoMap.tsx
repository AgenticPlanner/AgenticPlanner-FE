import React, { useEffect, useRef } from 'react';

interface KakaoMapProps {
    stops: any[];
    interactive?: boolean; // true면 좌표 클릭 시 팝업 띄우기 (MapPage 전용)
}

const KakaoMap = ({ stops, interactive = false }: KakaoMapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const currentOverlayRef = useRef<any>(null); // 현재 열린 오버레이 추적

    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null;
        const existingScript = document.getElementById('kakao-map-script');

        const initMap = () => {
            window.kakao.maps.load(() => {
                if (!mapContainer.current) return;

                // 지도 다시 그릴 때 기존 내용 지우기
                mapContainer.current.innerHTML = '';

                const { kakao } = window;
                const defaultCenter = new kakao.maps.LatLng(36.784, 126.450); // 아무것도 없을 때 기본 위치

                const map = new kakao.maps.Map(mapContainer.current, {
                    center: defaultCenter,
                    level: 5,
                });

                // 지도 클릭 시 열려있는 오버레이 닫기 (interactive 모드일 때만)
                if (interactive) {
                    kakao.maps.event.addListener(map, 'click', () => {
                        if (currentOverlayRef.current) {
                            currentOverlayRef.current.setMap(null);
                            currentOverlayRef.current = null;
                        }
                    });
                }

                const bounds = new kakao.maps.LatLngBounds();
                let hasValidMarker = false;

                // 선을 그릴 좌표 배열
                const linePath: any[] = [];

                // 마커 찍기 및 바운드 영역 넓히기
                if (stops && stops.length > 0) {
                    stops.forEach((stop) => {
                        const lat = Number(stop.lat);
                        const lng = Number(stop.lng);
                        // console.log(`stop: ${stop.title}, lat: ${lat}, lng: ${lng}`); // 좌표 확인용 로그

                        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                            hasValidMarker = true;
                            const position = new kakao.maps.LatLng(lat, lng);

                            // 마커 생성
                            const svgMarker = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 24 35">
                                    <path fill="#668369" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 23 12 23s12-14 12-23C24 5.4 18.6 0 12 0z"/>
                                    <circle cx="12" cy="12" r="5" fill="#ffffff"/>
                                </svg>
                            `;
                            // SVG 텍스트를 브라우저가 읽을 수 있는 이미지 URL(Data URI)로 변환
                            const imageSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarker);
                            const imageSize = new kakao.maps.Size(20, 40); // 핀 크기
                            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                            const marker = new kakao.maps.Marker({
                                position: position,
                                title: stop.title,
                                image: markerImage,
                                clickable: interactive // interactive 모드일 때만 클릭 가능
                            });
                            marker.setMap(map);

                            if (interactive) {
                                const naverUrl = stop.naverMapUrl || `https://map.naver.com/v5/search/${encodeURIComponent(stop.location || stop.title)}`;

                                // 순수 문자열 생성
                                const contentString = `
        <div style="position: relative; bottom: 45px; border-radius: 12px; background: #fff; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px rgba(0,0,0,0.1); min-width: 180px; padding: 12px;">
            <div style="display: inline-block; background: #edeff1; color: #668369; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">Day ${stop.dayNumber}</div>
            <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #1e293b;">${stop.title}</h4>
            <a href="${naverUrl}" target="_blank" rel="noopener noreferrer" style="
                text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 4px;
                padding: 6px; background: #03c75a; color: #fff; border-radius: 6px; font-size: 11px; font-weight: 600;
            ">🗺️ 길찾기</a>
            <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: #fff; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; transform: translateX(-50%) rotate(45deg);"></div>
        </div>
    `;
                                const overlay = new kakao.maps.CustomOverlay({
                                    content: contentString,
                                    position: position,
                                    yAnchor: 1,
                                    zIndex: 3,
                                    clickable: true
                                });

                                kakao.maps.event.addListener(marker, 'click', () => {
                                    if (currentOverlayRef.current) {
                                        currentOverlayRef.current.setMap(null);
                                    }
                                    overlay.setMap(map);
                                    currentOverlayRef.current = overlay;
                                });
                            }
                            bounds.extend(position);
                            linePath.push(position);
                        }
                    });
                }

                // 모인 좌표들로 선(Polyline) 그리기
                if (linePath.length > 1) {
                    const polyline = new kakao.maps.Polyline({
                        path: linePath,
                        strokeWeight: 4,
                        strokeColor: '#668369',
                        strokeOpacity: 0.9,
                        strokeStyle: 'shortdash'
                    });

                    polyline.setMap(map);
                }

                // 최초 렌더링 시 카메라 조정
                if (hasValidMarker) {
                    map.setBounds(bounds);
                }

                // 크기 변화 감지 센서
                resizeObserver = new ResizeObserver(() => {
                    map.relayout();
                    if (hasValidMarker) {
                        map.setBounds(bounds);
                    } else {
                        map.setCenter(defaultCenter);
                    }
                });

                resizeObserver.observe(mapContainer.current);
            });
        };

        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'kakao-map-script';
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=ce8916c125df4c8a3f9a595dd75f65a6&libraries=services&autoload=false`;
            script.onload = () => initMap();
            document.head.appendChild(script);
        } else {
            if (window.kakao && window.kakao.maps) {
                initMap();
            }
        }

        return () => {
            if (resizeObserver) resizeObserver.disconnect();
            if (currentOverlayRef.current) currentOverlayRef.current.setMap(null);
        };
    }, [stops, interactive]); // interactive 변경 시에도 다시 그리도록 추가

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8fafc',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.75rem'
            }}
        />
    );
};

export default React.memo(KakaoMap, (prevProps, nextProps) => {
    // 전 props, 후 props의 stops 배열을 JSON 문자열로 변환하여 비교 -> 배열 내용 같으면 리렌더링 방지
    return JSON.stringify(prevProps.stops) === JSON.stringify(nextProps.stops) && prevProps.interactive === nextProps.interactive;
});