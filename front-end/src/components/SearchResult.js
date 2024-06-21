import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  isDetail,
  setCurrentDetailId,
  setCurrentTargetPlaceX,
  setCurrentTargetPlaceY,
  setSearchDetailInfo,
} from "../features/search/searchSlice";
import { useLocation, useNavigate } from "react-router-dom";

function SearchResult() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState("");
  const searchResult = useSelector((state) => state.search.searchResult);
  const [currentId, setCurrentId] = useState("");

  const fetchDetailData = async ({ queryKey }) => {
    const [_, id, x, y] = queryKey;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/detail/${id}`
      );
      const data = response.data;
      return { data, x, y };
    } catch (error) {
      console.error("요청 에러:", error);
      throw new Error("Failed to fetch detail data");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["detail", currentId?.[0], currentId?.[1], currentId?.[2]],
    queryFn: fetchDetailData,
    enabled: !!currentId, // currentId가 있을 때만 쿼리를 활성화
  });

  const dataHandler = (id, x, y) => {
    setCurrentId([id, x, y]);
    navigate(`/detail/${id}`);
  };

  useEffect(() => {
    if (data) {
      dispatch(isDetail(true));
      dispatch(setSearchDetailInfo(data.data));
      dispatch(setCurrentDetailId(currentId[0]));
      dispatch(setCurrentTargetPlaceX(currentId[2]));
      dispatch(setCurrentTargetPlaceY(currentId[1]));
      setCurrentURL(location);
      console.log(data);
    }
  }, [data, dispatch, currentId, navigate, location]);

  useEffect(() => {
    if (location.pathname.startsWith("/detail")) {
      const id = location.pathname.split("/detail/")[1];
      setCurrentId([id, null, null]); // x, y 값을 null로 설정하여 currentId 업데이트
    }
  }, [location]);

  return (
    <div className="space-y-2">
      {searchResult.map((result, i) =>
        searchResult.length === 1 ? (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
            onClick={() => {
              console.log(result);
              dataHandler(result.id, result.x, result.y);
            }}
          >
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-lg text-blue-800 align-middle">
                {result.place_name}
              </h4>
            </div>
            <p className="text-lg text-blue-500">{result.address_name}</p>
            {result.road_address && (
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500 bg-white border rounded px-1 py-0.5">
                  도로명
                </div>
                <p className="text-xs text-gray-500">
                  {result.road_address.address_name}
                </p>
              </div>
            )}
            {result.road_address && (
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500 bg-white border rounded px-1 py-0.5">
                  우
                </div>
                <p className="text-xs text-gray-500">
                  {result.road_address.zone_no}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
            onClick={() => dataHandler(result.id, result.x, result.y)}
          >
            <h4 className=" text-lg text-blue-500">{result.place_name}</h4>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 bg-white border rounded px-1 py-0.5">
                주소
              </div>
              <p className="text-gray-500">{result.address_name}</p>
            </div>
            {!result.phone == "" && (
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500 bg-white border rounded px-1 py-0.5">
                  전화번호
                </div>
                <p className="text-gray-500">{result.phone}</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
export default SearchResult;
