import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAddressFalse,
  setIsAddressTrue,
  setSearchResult,
} from "../features/search/searchSlice";

function Map() {
  const dispatch = useDispatch();
  const searchWord = useSelector((state) => state.search.searchWord);
  const searchCount = useSelector((state) => state.search.searchCount);
  const isAddress = useSelector((state) => state.search.isAddress);
  const searchResult = useSelector((state) => state.search.searchResult);
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
  }, []);

  // 지도 초기화 함수
  const initializeMap = (lat, lng) => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    const createdMap = new window.kakao.maps.Map(container, options);
    setMap(createdMap);
  };

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
      markers.forEach((marker) => marker.setMap(null));
      handleSearch();
      setMarkers([]);
    }
  }, [searchWord, searchCount]);

  // function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  //   var R = 6371; // 지구의 반경 (km)
  //   var dLat = deg2rad(lat2 - lat1);
  //   var dLon = deg2rad(lon2 - lon1);
  //   var a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(deg2rad(lat1)) *
  //       Math.cos(deg2rad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   var d = R * c; // 거리 (km)
  //   return d * 1000; // 미터로 변환
  // }

  // function deg2rad(deg) {
  //   return deg * (Math.PI / 180);
  // }

  const handleSearch = () => {
    if (!map || !searchWord) return;

    setLoading(true);
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    let accumulatedResults = [];

    const searchOption = {
      location: map.getCenter(),
      radius: 10000, // 예시로 1,000,000미터 설정
    };

    const ps = new window.kakao.maps.services.Places();
    const geocoder = new window.kakao.maps.services.Geocoder();

    const mergeResults = () => {
      if (accumulatedResults.length > 0) {
        dispatch(setSearchResult(accumulatedResults));
        setData(accumulatedResults);
        displayPlaces(accumulatedResults);
      } else {
        alert("검색 결과가 없습니다.");
      }
      setLoading(false);
    };

    const addressSearchCallback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        accumulatedResults = accumulatedResults.concat(result);
      }
      // 키워드 검색 시작

      ps.keywordSearch(searchWord, keywordSearchCallback, searchOption);
    };

    const keywordSearchCallback = (places, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const filteredPlaces = places.filter((place) =>
          map
            .getBounds()
            .contain(new window.kakao.maps.LatLng(place.y, place.x))
        );
        accumulatedResults = accumulatedResults.concat(
          filteredPlaces.length > 0 ? filteredPlaces : places
        );

        if (pagination.hasNextPage) {
          pagination.nextPage(keywordSearchCallback);
        } else {
          mergeResults();
        }
      } else {
        mergeResults();
      }
    };

    // 주소 검색을 먼저 시작
    geocoder.addressSearch(searchWord, addressSearchCallback);
  };

  // 장소를 표시하는 함수
  const displayPlaces = (places) => {
    console.log("Places data:", places);
    const newMarkers = places.map((place) => {
      console.log("Creating marker for:", place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
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

    setMarkers(newMarkers); // 여기서 마커 배열을 업데이트합니다.
    // console.log(places[0].x);
    if (places.length > 0) {
      const newCenter = new window.kakao.maps.LatLng(places[0].y, places[0].x);
      map.setCenter(newCenter);
    }
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
