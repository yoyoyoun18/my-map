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
  const [basicInfo, setBasicInfo] = useState({
    basicInfo: {
      placenamefull: null,
    },
  });
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
        console.log(response.data);
      })
      .catch((error) => {
        console.error("요청 에러:", error);
      });
  };

  const detailData = (address_name) => {
    const data = {
      basicInfo: {
        placenamefull: address_name,
      },
    };
    dispatch(isDetail(true));
    navigate(`/detail/${address_name}`);
    dispatch(setSearchDetailInfo(address_name));
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
              detailData(result.address_name, result);
            }}
          >
            <div className="flex items-center space-x-2">
              {" "}
              {/* 아이콘 */}
              <h4 className="font-semibold text-lg text-blue-800 align-middle">
                {result.place_name}
              </h4>
            </div>
            <p className="text-lg text-blue-500">{result.address_name}</p>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 bg-white border rounded px-1 py-0.5">
                도로명
              </div>
              <p className="text-xs text-gray-500">
                {result.road_address.address_name}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 bg-white border rounded px-1 py-0.5">
                우
              </div>
              <p className="text-xs text-gray-500">
                {result.road_address.zone_no}
              </p>
            </div>
          </div>
        ) : (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
            // onClick={() => fetchDetailData(result.id, result.x, result.y)}
            onClick={() => fetchDetailData(result.id, result.x, result.y)}
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
