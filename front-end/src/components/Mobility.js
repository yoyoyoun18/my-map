import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSearchRouteMode } from "../features/mobility/mobilitySlice";
import { setRoute } from "../features/route/routeSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Mobility() {
  const [isFocus, setIsFocus] = useState(""); // 어떤 버튼이 포커스 되었는지 저장
  const dispatch = useDispatch();
  const handleFocus = (target) => {
    setIsFocus(target); // 클릭된 버튼의 이름을 상태에 저장
  };

  const arrive = useSelector((state) => state.mobility.arrive);
  const depart = useSelector((state) => state.mobility.depart);
  const currentDepartPlaceX = useSelector(
    (state) => state.search.currentDepartPlaceX
  );
  const currentDepartPlaceY = useSelector(
    (state) => state.search.currentDepartPlaceY
  );
  const currentArrivePlaceX = useSelector(
    (state) => state.search.currentArrivePlaceX
  );
  const currentArrivePlaceY = useSelector(
    (state) => state.search.currentArrivePlaceY
  );

  const [error, setError] = useState(null);

  const closeRouteMode = () => {
    dispatch(setSearchRouteMode(false));
  };

  const handleSearchRoute = () => {
    // 여기서 axios를 사용하여 경로 검색 API를 호출합니다.
    axios
      .get("https://apis-navi.kakaomobility.com/v1/directions", {
        params: {
          origin: `${currentDepartPlaceY},${currentDepartPlaceX}`, // 위도, 경도 순서
          destination: `${currentArrivePlaceY},${currentArrivePlaceX}`, // 위도, 경도 순서
        },
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`, // 발급받은 REST API 키를 사용합니다.
        },
      })
      .then((response) => {
        console.log("API 응답:", response);
        const routes = response.data.routes;
        if (routes && routes.length > 0 && routes[0].sections) {
          dispatch(setRoute(routes[0].sections[0].guides)); // 경로 데이터 설정
          setError(null);
          console.log(routes[0].sections[0].guides);
        } else {
          setError("경로 데이터를 찾을 수 없습니다.");
          dispatch(setRoute(null));
        }
      })
      .catch((err) => {
        console.error("API 호출 에러: ", err);
        setError(err.message);
        dispatch(setRoute(null));
      });
  };

  return (
    <div
      className="p-4 overflow-y-auto bg-white w-80 relative z-50"
      style={{ flexShrink: 0 }}
    >
      <button
        onClick={closeRouteMode}
        className="absolute top-2 right-2 z-50 p-2 bg-white text-gray-700 rounded-full text-xl font-bold"
      >
        X
      </button>
      <div className="w-full px-4 py-6">
        <p className="break-keep text-sm text-neutral-500">
          도착지 / 출발지를 선택 후 검색 또는 메뉴를 통해 이동할 곳을
          선택해주세요!
        </p>
        <div className="mt-2 w-full rounded border border-neutral-400">
          <input
            name="origin"
            hidden
            readOnly
            value="127.02981939169952,37.514017465016785"
          />
          <button
            type="button"
            className={`relative w-full cursor-pointer rounded-t border-b-[1px] p-2 text-left outline-none ${
              isFocus === "origin"
                ? "border-black border-2"
                : "border-neutral-400"
            }`}
            onClick={() => handleFocus("origin")}
          >
            {!depart ? (
              <span className="text-neutral-400">출발지를 선택해주세요.</span>
            ) : (
              depart
            )}
          </button>
          <input name="destination" hidden readOnly value="" />
          <button
            type="button"
            className={`w-full cursor-pointer rounded-b p-2 text-left outline-none ${
              isFocus === "destination"
                ? "border-black border-2"
                : "border-neutral-400"
            }`}
            onClick={() => handleFocus("destination")}
          >
            {!arrive ? (
              <span className="text-neutral-400">도착지를 선택해주세요.</span>
            ) : (
              arrive
            )}
          </button>
        </div>
        <button
          type="submit"
          className="bg-interaction mt-2 rounded-full px-5 py-1 text-white bg-gray-900"
          onClick={() =>
            arrive && depart
              ? handleSearchRoute()
              : toast.warn("출발지, 도착지를 설정해주세요.")
          }
        >
          길찾기
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Mobility;
