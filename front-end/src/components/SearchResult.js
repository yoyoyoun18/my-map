import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  isDetail,
  setCurrentDetailId,
  setCurrentTargetPlace,
  setCurrentTargetPlaceX,
  setCurrentTargetPlaceY,
  setSearchDetailInfo,
} from "../features/search/searchSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function SearchResult() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState("");
  const detailPageState = useSelector((state) => state.search.detailPageState);
  const searchDetailInfo = useSelector(
    (state) => state.search.searchDetailInfo
  );
  const searchResult = useSelector((state) => state.search.searchResult);

  const fetchDetailData = (id, x, y) => {
    axios
      .get(`http://localhost:8080/api/detail/${id}`)
      .then((response) => {
        dispatch(isDetail(true));
        dispatch(setSearchDetailInfo(response.data));
        dispatch(setCurrentDetailId(id));
        dispatch(setCurrentTargetPlaceX(y));
        dispatch(setCurrentTargetPlaceY(x));
        navigate(`/detail/${id}`);
        setCurrentURL(location);
      })
      .catch((error) => {
        console.error("요청 에러:", error);
      });
  };

  useEffect(() => {
    if (location.pathname.startsWith("/detail")) {
      const id = location.pathname.split("/detail/")[1];
      axios
        .get(`http://localhost:8080/api/detail/${id}`)
        .then((response) => {
          dispatch(isDetail(true));
          dispatch(setSearchDetailInfo(response.data));
          dispatch(setCurrentDetailId(id));
          setCurrentURL(location);
        })
        .catch((error) => {
          console.error("요청 에러:", error);
        });
    }
  }, [location, dispatch]);

  return (
    <div className="space-y-2">
      {searchResult.map((result, i) =>
        searchResult.length == 1 ? (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
            onClick={() => {
              console.log(result);
              fetchDetailData(result.id, result.x, result.y);
            }}
          >
            <div className="flex items-center space-x-2">
              {" "}
              {/* Flex 컨테이너 */}
              <FontAwesomeIcon
                icon={faHome}
                className="text-blue-800 align-middle icon-size"
              />{" "}
              {/* 아이콘 */}
              <h4 className="font-semibold text-lg text-blue-800 align-middle">
                {result.place_name}
              </h4>
            </div>
            <p className="text-xl font-bold text-gray-800">
              지번: {result.address_name}
            </p>
            <p className="text-sm text-gray-500">
              {/* 도로명 주소: {result.road_address.address_name} */}
            </p>
            <p className="text-sm text-gray-500">
              {/* 우편 주소: {result.road_address.zone_no} */}
            </p>
          </div>
        ) : (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
            onClick={() => fetchDetailData(result.id, result.x, result.y)}
          >
            <h4 className="font-semibold text-lg text-gray-800">
              {result.place_name}
            </h4>
            <p className="text-gray-500">주소: {result.address_name}</p>
            {!result.phone == "" && (
              <p className="text-gray-500">전화번호: {result.phone}</p>
            )}
          </div>
        )
      )}
    </div>
  );
}
export default SearchResult;
