import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isDetail } from "../features/search/searchSlice";
import axios from "axios";
import {
  isArrive,
  isDepart,
  setSearchRouteMode,
} from "../features/mobility/mobilitySlice";

function Detail() {
  const dispatch = useDispatch();
  const searchDetailInfo = useSelector(
    (state) => state.search.searchDetailInfo
  );
  const currentDetailId = useSelector((state) => state.search.currentDetailId);
  const token = useSelector((state) => state.auth.token);
  const detailPageState = useSelector((state) => state.search.detailPageState);

  const closeDetail = () => {
    dispatch(isDetail(false));
  };

  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    id: currentDetailId,
    name: "",
    comment: "",
  });

  useEffect(() => {
    if (detailPageState) {
      axios
        .get(`http://localhost:8080/reviews?id=${currentDetailId}`)
        .then((response) => {
          setReviews(response.data);
          console.log(searchDetailInfo);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [currentDetailId, detailPageState]);

  useEffect(() => {
    setNewReview((prevState) => ({ ...prevState, id: currentDetailId }));
  }, [currentDetailId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleAddReview = () => {
    if (newReview.name && newReview.comment) {
      axios
        .post("http://localhost:8080/review", newReview)
        .then((response) => {
          setReviews([
            ...reviews,
            {
              id: currentDetailId,
              name: newReview.name,
              comment: newReview.comment,
            },
          ]);
          setNewReview({ id: currentDetailId, name: "", comment: "" });
        })
        .catch((error) => {
          console.error("There was an error saving the review", error);
        });
    }
  };

  const handleDepartPlace = () => {
    dispatch(isDepart(searchDetailInfo.basicInfo.placenamefull));
    dispatch(setSearchRouteMode(true));
  };

  const handleArrivePlace = () => {
    dispatch(isArrive(searchDetailInfo.basicInfo.placenamefull));
    dispatch(setSearchRouteMode(true));
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
      <div className="text-left my-2 text-lg font-bold">
        {searchDetailInfo
          ? searchDetailInfo.basicInfo.placenamefull
          : "장소 이름"}
      </div>
      <div className="flex my-4 justify-end ">
        <button
          className="px-4 py-2 font-bold text-black bg-none rounded hover:bg-gray-200 mr-2 border-black border"
          onClick={handleDepartPlace}
        >
          출발
        </button>
        <button
          className="px-4 py-2 font-bold text-black bg-none rounded hover:bg-gray-200 border-black border"
          onClick={handleArrivePlace}
        >
          도착
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">후기</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-semibold">{review.name}</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      {token && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">댓글 작성</h2>
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={newReview.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded hidden"
            />
            <textarea
              name="comment"
              placeholder="댓글"
              value={newReview.comment}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddReview}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              댓글 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
