import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  isDetail,
  setCurrentDetailId,
  setCurrentTargetPlaceX,
  setCurrentTargetPlaceY,
  setSearchDetailInfo,
} from "../features/search/searchSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, SearchResult as SearchResultType } from "../types";

const SearchResult: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [currentURL, setCurrentURL] = useState<string>("");
  const searchResult = useSelector(
    (state: RootState) => state.search.searchResult
  );
  const [currentId, setCurrentId] = useState<
    [string, string | null, string | null] | null
  >(null);
  const [placeId, setPlaceId] = useState<string>("");
  const currentTargetPlaceX = useSelector(
    (state: RootState) => state.search.currentTargetPlaceX
  );

  const fetchDetailData = async (id: any) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/detail/${id}`
    );
    return response.data;
  };

  const fetchMultipleTimes = async (id: any) => {
    const results = [];
    for (let i = 0; i < 100; i++) {
      results.push(fetchDetailData(id));
    }
    return Promise.all(results);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["detail", currentId?.[0] ?? null],
    queryFn: () => fetchMultipleTimes(currentId?.[0]),
    enabled: !!currentId,
    staleTime: 1000 * 60 * 5,
  });

  const sendMultipleRequests = async (id: string) => {
    const requests = [];
    for (let i = 0; i < 100; i++) {
      requests.push(
        axios.get(`${process.env.REACT_APP_API_URL}/api/detail/${id}`)
      );
    }

    try {
      await Promise.all(requests);
      console.log("All requests completed");
    } catch (error) {
      console.error("Error with requests:", error);
    }
  };

  const dataHandler = (id: string, x: string, y: string) => {
    setCurrentId([id, x, y]);
    setPlaceId(id);
    dispatch(setCurrentDetailId(id));
    dispatch(setCurrentTargetPlaceX(parseFloat(y)));
    dispatch(setCurrentTargetPlaceY(parseFloat(x)));
    navigate(`/detail/${id}`);
    sendMultipleRequests(id);
  };

  useEffect(() => {
    if (data) {
      dispatch(isDetail(true));
      dispatch(setSearchDetailInfo(data[0]));
      dispatch(setCurrentDetailId(currentId![0]));
      setCurrentURL(location.pathname);
    }
    const cachedData = queryClient.getQueryData([
      "detail",
      currentId?.[0] ?? null,
    ]);
    console.log("Cached Data:", cachedData);
  }, [data, dispatch, currentId, navigate, location, placeId]);

  useEffect(() => {
    if (location.pathname.startsWith("/detail")) {
      const id = location.pathname.split("/detail/")[1];
      setCurrentId([id, null, null]); // x, y 값을 null로 설정하여 currentId 업데이트
    }
  }, [location]);

  return (
    <div className="space-y-2">
      {searchResult.map((result: SearchResultType, i: number) =>
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
            {result.phone && result.phone !== "" && (
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
};

export default SearchResult;
