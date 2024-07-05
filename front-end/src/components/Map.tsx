import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementSearchCount,
  isDetail,
  setCurrentDetailId,
  setSearchDetailInfo,
  setSearchResult,
  setSearchWord,
} from "../features/search/searchSlice";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../types";

const Map: React.FC = () => {
  const dispatch = useDispatch();
  const route = useSelector((state: RootState) => state.route.route);
  const currentDepartPlaceX = useSelector(
    (state: RootState) => state.search.currentDepartPlaceX
  );
  const currentDepartPlaceY = useSelector(
    (state: RootState) => state.search.currentDepartPlaceY
  );
  const currentArrivePlaceX = useSelector(
    (state: RootState) => state.search.currentArrivePlaceX
  );
  const currentArrivePlaceY = useSelector(
    (state: RootState) => state.search.currentArrivePlaceY
  );
  const currentTargetPlaceX = useSelector(
    (state: RootState) => state.search.currentTargetPlaceX
  );
  const currentTargetPlaceY = useSelector(
    (state: RootState) => state.search.currentTargetPlaceY
  );

  const searchWord = useSelector((state: RootState) => state.search.searchWord);
  const searchCount = useSelector(
    (state: RootState) => state.search.searchCount
  );
  const searchResult = useSelector(
    (state: RootState) => state.search.searchResult
  );
  const locations = ["편의점", "식당", "카페", "주차장", "마트"];
  const location = useLocation();
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [center, setCenter] = useState<kakao.maps.LatLng | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [polyline, setPolyline] = useState<kakao.maps.Polyline | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeMap(position.coords.latitude, position.coords.longitude);
        },
        () => {
          initializeMap(37.5662952, 126.9779451);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
      initializeMap(37.5662952, 126.9779451);
    }
  }, []);

  const handleSearchWord = (bookmarkWord: string) => {
    dispatch(setSearchWord(bookmarkWord));
    dispatch(incrementSearchCount());
  };

  const testSearchResultId = (id: string) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/detail/${id}`)
      .then((response) => {
        dispatch(isDetail(true));
        dispatch(setSearchDetailInfo(response.data));
        dispatch(setCurrentDetailId(id));
        navigate(`/detail/${id}`);
      })
      .catch((error) => {
        console.error("요청 에러:", error);
      });
  };

  const initializeMap = (lat: number, lng: number) => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    const createdMap = new kakao.maps.Map(container, options);
    setMap(createdMap);
  };

  useEffect(() => {
    if (map) {
      const handleCenterChange = () => {
        if (map) {
          const newCenter = map.getCenter();
          setCenter(newCenter);
        }
      };
      kakao.maps.event.addListener(map, "center_changed", handleCenterChange);

      return () => {
        if (map) {
          kakao.maps.event.removeListener(
            map,
            "center_changed",
            handleCenterChange
          );
        }
      };
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      markers.forEach((marker) => marker.setMap(null));
      handleSearch();
      setMarkers([]);
      navigate(`/search/${searchWord}`);
    }
  }, [searchWord, searchCount]);

  useEffect(() => {
    if (location.pathname.startsWith("/search")) {
      const id = decodeURIComponent(location.pathname.split("/search/")[1]);
      dispatch(setSearchWord(id));
    }
  }, [location]);

  const handleSearch = () => {
    if (!map || !searchWord) return;

    setLoading(true);
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    let accumulatedResults: any[] = [];

    const searchOption = {
      location: map.getCenter(),
      radius: 10000,
    };

    const ps = new kakao.maps.services.Places();
    const geocoder = new kakao.maps.services.Geocoder();

    const mergeResults = () => {
      if (accumulatedResults.length > 0) {
        dispatch(setSearchResult(accumulatedResults));
        displayPlaces(accumulatedResults);
      } else {
        alert("검색 결과가 없습니다.");
      }
      setLoading(false);
    };

    const addressSearchCallback = (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        accumulatedResults = accumulatedResults.concat(result);
      }
      ps.keywordSearch(searchWord, keywordSearchCallback, searchOption);
    };

    const keywordSearchCallback = (
      places: any,
      status: any,
      pagination: any
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        const filteredPlaces = places.filter((place: any) =>
          map.getBounds().contain(new kakao.maps.LatLng(place.y, place.x))
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

    geocoder.addressSearch(searchWord, addressSearchCallback);
  };

  const displayPlaces = (places: any[]) => {
    const newMarkers = places.map((place: any) => {
      const marker = new kakao.maps.Marker({
        map: map!,
        position: new kakao.maps.LatLng(place.y, place.x),
      });
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      });

      kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map!, marker);
      });

      kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close();
      });

      kakao.maps.event.addListener(marker, "click", () => {
        testSearchResultId(place.id);
      });

      return marker;
    });

    setMarkers(newMarkers);
    if (places.length > 0) {
      const newCenter = new kakao.maps.LatLng(places[0].y, places[0].x);
      map!.setCenter(newCenter);
    }
  };

  useEffect(() => {
    if (map && route) {
      if (polyline) {
        polyline.setMap(null);
      }

      markers.forEach((marker) => marker.setMap(null));

      const linePath = route.map(
        (point) => new kakao.maps.LatLng(point.y, point.x)
      );
      const newPolyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      newPolyline.setMap(map);

      setPolyline(newPolyline);

      const departMarker = new kakao.maps.Marker({
        map: map!,
        position: new kakao.maps.LatLng(
          currentDepartPlaceX || 0,
          currentDepartPlaceY || 0
        ),
      });

      const arriveMarker = new kakao.maps.Marker({
        map: map!,
        position: new kakao.maps.LatLng(
          currentArrivePlaceX || 0,
          currentArrivePlaceY || 0
        ),
      });

      setMarkers([departMarker, arriveMarker]);
    }
  }, [map, route]);

  useEffect(() => {
    if (map && currentTargetPlaceX && currentTargetPlaceY) {
      markers.forEach((marker) => marker.setMap(null));

      const currentTargetMarker = new kakao.maps.Marker({
        map: map!,
        position: new kakao.maps.LatLng(
          currentTargetPlaceX || 0,
          currentTargetPlaceY || 0
        ),
      });

      setMarkers([currentTargetMarker]);
      map.setCenter(
        new kakao.maps.LatLng(
          currentTargetPlaceX || 0,
          currentTargetPlaceY || 0
        )
      );
    }
  }, [map, currentTargetPlaceX, currentTargetPlaceY]);

  return (
    <div className="relative h-full bg-gray-300">
      <div className="absolute top-0 left-0 p-4">
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          {locations.map((location, index) => (
            <button
              key={index}
              className="relative z-50 w-24 h-10 px-3 py-2 font-bold text-gray-700 bg-white rounded-lg shadow cursor-pointer hover:text-blue-500 transition-colors duration-300 ease-in-out"
              onClick={() => handleSearchWord(location)}
            >
              #{location}
            </button>
          ))}
        </div>
      </div>
      <div id="map" className="absolute inset-x-0 top-0 bottom-0 pt-16"></div>
    </div>
  );
};

export default Map;
