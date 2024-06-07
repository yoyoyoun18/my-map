import React, { useEffect, useState } from "react";
import { setSearchRouteMode } from "../features/mobility/mobilitySlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Mobility() {
  const [isFocus, setIsFocus] = useState(""); // 어떤 버튼이 포커스 되었는지 저장
  const dispatch = useDispatch();
  const handleFocus = (target) => {
    setIsFocus(target); // 클릭된 버튼의 이름을 상태에 저장
  };
  const arrive = useSelector((state) => state.mobility.arrive);
  const depart = useSelector((state) => state.mobility.depart);
  const currentDepartPlaceX = useSelector(
    (state) => state.mobility.currentDepartPlaceX
  );
  const currentArrivePlace = useSelector(
    (state) => state.mobility.currentArrivePlace
  );
  //   const origin = `'${currentDepartPlace.x},${currentDepartPlace.y}'`;
  //   const destination = `'${currentArrivePlace.x},${currentArrivePlace.y}'`;
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  const closeRouteMode = () => {
    dispatch(setSearchRouteMode(false));
  };

  useEffect(() => {
    console.log(currentDepartPlaceX);
  }, []);

  //   const handleSearchRoute = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8080/api/directions", {
  //         params: {
  //           origin,
  //           destination,
  //         },
  //       });
  //       setRoute(response.data);
  //       setError(null);
  //     } catch (err) {
  //       setError(err.message);
  //       setRoute(null);
  //     }
  //   };
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
            className={`relative w-full cursor-pointer rounded-t border-b-[1px] p-2 text-left outline-none  ${
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
          //   onClick={() => handleSearchRoute}
        >
          길찾기
        </button>
      </div>
    </div>
  );
}

export default Mobility;
