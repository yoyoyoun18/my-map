import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Map() {
  const searchWord = useSelector((state) => state.search.searchWord);
  const locations = ["서울", "부산", "대구", "인천", "광주"];
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState();
  const [markers, setMarkers] = useState([]);
  const [data, setData] = useState(null);
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myLocationCount, setMyLocationCount] = useState(0);

  useEffect(() => {
    // 브라우저에서 위치 접근 권한 요청
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 접근 성공 시
          initializeMap(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // 위치 접근 실패 시 기본 위치 사용 (서울시청)
          initializeMap(37.5662952, 126.9779451);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      // Geolocation이 지원되지 않는 경우
      alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
      initializeMap(37.5662952, 126.9779451); // 기본 위치 설정
    }
  }, [myLocationCount]);

  // 지도 초기화 함수
  const initializeMap = (lat, lng) => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    const createdMap = new window.kakao.maps.Map(container, options);
    setMap(createdMap);

    // 타일이 로드된 후에 실행될 이벤트 리스너 추가
    window.kakao.maps.event.addListener(createdMap, "tilesloaded", () => {
      displayPlaces([
        {
          y: lat,
          x: lng,
          place_name: "내 위치",
        },
      ]);
    });
  };

  //   useEffect(() => {
  //     setKeyword(searchWord);
  //   }, [searchWord]);

  // 지도의 중심좌표 변경 감지
  useEffect(() => {
    if (map) {
      const handleCenterChange = () => {
        const newCenter = map.getCenter();
        setCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() }); // 새로운 중심 좌표 객체를 상태로 저장
      };
      window.kakao.maps.event.addListener(
        map,
        "center_changed",
        handleCenterChange
      );

      return () => {
        window.kakao.maps.event.removeListener(
          map,
          "center_changed",
          handleCenterChange
        );
      };
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      displayPlaces([
        {
          y: map.getCenter().getLat(),
          x: map.getCenter().getLng(),
          place_name: "내 위치",
        },
      ]);
    }
  }, [map]);

  // 중심 좌표나 검색어 변경 시 검색 실행
  useEffect(() => {
    if (map && searchWord) {
      handleSearch();
      setMarkers([]);
    }
  }, [searchWord, map]);

  // 데이터 변경 감지
  //   useEffect(() => {
  //     if (data) {
  //       handleDataUpdate(data);
  //     }
  //   }, [data]);

  // 검색 실행

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // 지구의 반경 (km)
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // 거리 (km)
    return d * 1000; // 미터로 변환
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const handleSearch = () => {
    if (!map || !searchWord) return;

    setLoading(true);
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const bounds = map.getBounds();
    const center = map.getCenter();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const radius =
      getDistanceFromLatLonInKm(
        sw.getLat(),
        sw.getLng(),
        ne.getLat(),
        ne.getLng()
      ) / 2;
    const searchOption = {
      location: center,
      radius: radius,
    };

    const ps = new window.kakao.maps.services.Places();
    let accumulatedResults = []; // 임시 배열로 누적된 결과를 저장합니다.

    // 재귀적으로 검색 결과를 누적하는 함수
    const fetchResults = (callback, pagination = null) => {
      if (pagination) {
        pagination.nextPage(callback); // 다음 페이지 요청
      } else {
        ps.keywordSearch(searchWord, callback, searchOption); // 첫 페이지 요청
      }
    };

    const processResults = (places, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        accumulatedResults = accumulatedResults.concat(
          places.filter((place) =>
            map
              .getBounds()
              .contain(new window.kakao.maps.LatLng(place.y, place.x))
          )
        );
        if (pagination.hasNextPage) {
          fetchResults(processResults, pagination);
        } else {
          setData(accumulatedResults); // 모든 페이지의 데이터 로드가 완료되면 상태 업데이트
          displayPlaces(accumulatedResults);
          console.log(accumulatedResults);
          setLoading(false);
        }
      } else {
        setLoading(false);
        alert("검색 결과가 없습니다.");
      }
    };

    fetchResults(processResults); // 검색 시작
  };

  // 장소를 표시하는 함수
  const displayPlaces = (places) => {
    console.log("Places data:", places); // 데이터 구조 확인을 위한 로그
    const newMarkers = places.map((place) => {
      console.log("Creating marker for:", place.y, place.x); // 마커 생성 정보 로그
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x), // 위치 생성 시 위도, 경도 순서 확인
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close();
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  // 현재 위치에서 재검색 버튼 클릭 시 실행되는 함수
  const handleCurrentSearch = () => {
    setMyLocationCount((myLocationCount) => myLocationCount + 1);
  };

  return (
    <div className="relative h-full bg-gray-300">
      {/* 상단 버튼 리스트 */}
      <div className="absolute top-0 left-0 p-4">
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          {locations.map((location, index) => (
            <button
              key={index}
              className="relative z-50 w-24 h-10 px-3 py-2 font-bold text-blue-500 bg-transparent border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white"
              //   onClick={() => handleLocationClick(location)}
            >
              #{location}
            </button>
          ))}
        </div>
      </div>
      {/* 지도 표시 영역 */}
      <div id="map" className="absolute inset-x-0 top-0 bottom-0 pt-16"></div>
    </div>
  );
}

export default Map;
