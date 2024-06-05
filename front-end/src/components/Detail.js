import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isDetail } from "../features/search/searchSlice";

function Detail() {
  const dispatch = useDispatch();
  const searchDetailInfo = useSelector(
    (state) => state.search.searchDetailInfo
  );
  const searchResult = useSelector((state) => state.search.searchResult);
  const closeDetail = () => {
    dispatch(isDetail(false));
  };

  return (
    <div
      className="p-4 overflow-y-auto bg-white w-80 relative z-50"
      style={{ flexShrink: 0 }}
    >
      <button
        onClick={closeDetail}
        className="absolute top-2 right-2 z-50 p-2 bg-white text-gray-700 rounded-full text-xl font-bold"
      >
        X
      </button>
      {/* 이미지 표시 영역 */}
      <div
        className="flex items-center justify-center h-48 bg-gray-200 bg-center bg-contain"
        style={{
          backgroundImage:
            searchDetailInfo &&
            searchDetailInfo.photo &&
            searchDetailInfo.photo.photoList[0] &&
            searchDetailInfo.photo.photoList[0].list[0]
              ? `url(${searchDetailInfo.photo.photoList[0].list[0].orgurl})`
              : "none",
        }}
      ></div>

      {/* 출발/도착 버튼 */}
      <div className="flex my-4 justify-end ">
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 mr-2">
          출발
        </button>
        <button className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
          도착
        </button>
      </div>

      {/* 후기 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">후기</h2>
        <p>"정말 좋아요!" - 홍길동</p>
        <p>"분위기가 아늑해요." - 김철수</p>
      </div>
      <div className="mb-4">asdawfwaf</div>
    </div>
  );
}

export default Detail;
