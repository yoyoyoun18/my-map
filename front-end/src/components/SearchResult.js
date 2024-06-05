import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isDetail, setSearchDetailInfo } from "../features/search/searchSlice";

function SearchResult() {
  const dispatch = useDispatch();
  const detailPageState = useSelector((state) => state.search.detailPageState);
  const searchDetailInfo = useSelector(
    (state) => state.search.searchDetailInfo
  );
  const testSearchResultId = (id) => {
    axios
      .get(`http://localhost:8080/api/data/${id}`)
      .then((response) => {
        dispatch(isDetail(true));
        dispatch(setSearchDetailInfo(response.data));
      })
      .catch((error) => {
        console.error("요청 에러:", error);
      });
  };

  const searchResult = useSelector((state) => state.search.searchResult);
  return (
    <div className="space-y-2">
      {searchResult.map((result, i) =>
        searchResult.length == 1 ? (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer" // 여기에 onClick
            onClick={() => testSearchResultId(result.id)}
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
              도로명 주소: {result.road_address.address_name}
            </p>
            <p className="text-sm text-gray-500">
              우편 주소: {result.road_address.zone_no}
            </p>
          </div>
        ) : (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
            onClick={() => testSearchResultId(result.id)}
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
