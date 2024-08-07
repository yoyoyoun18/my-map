import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isDetail,
  setCurrentArrivePlaceX,
  setCurrentArrivePlaceY,
  setCurrentDepartPlaceX,
  setCurrentDepartPlaceY,
} from "../features/search/searchSlice";
import axios from "axios";
import {
  isArrive,
  isDepart,
  setSearchRouteMode,
} from "../features/mobility/mobilitySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../types";

const Detail: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const searchDetailInfo = useSelector(
    (state: RootState) => state.search.searchDetailInfo
  );
  const currentDetailId = useSelector(
    (state: RootState) => state.search.currentDetailId
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const detailPageState = useSelector(
    (state: RootState) => state.search.detailPageState
  );
  const currentTargetPlaceX = useSelector(
    (state: RootState) => state.search.currentTargetPlaceX
  );
  const currentTargetPlaceY = useSelector(
    (state: RootState) => state.search.currentTargetPlaceY
  );
  const currentArrivePlaceX = useSelector(
    (state: RootState) => state.search.currentArrivePlaceX
  );
  const currentDepartPlaceX = useSelector(
    (state: RootState) => state.search.currentDepartPlaceX
  );
  const currentArrivePlaceY = useSelector(
    (state: RootState) => state.search.currentArrivePlaceY
  );

  const closeDetail = () => {
    dispatch(isDetail(false));
  };

  const [reviews, setReviews] = useState<any[]>([]);

  const [newReview, setNewReview] = useState({
    id: currentDetailId,
    name: user,
    comment: "",
  });

  useEffect(() => {
    if (detailPageState) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/reviews?id=${currentDetailId}`)
        .then((response) => {
          setReviews(response.data);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [currentDetailId, detailPageState]);

  useEffect(() => {
    setNewReview((prevState) => ({ ...prevState, id: currentDetailId }));
  }, [currentDetailId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const fetchUserJoinDays = async (username: any) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/join-days/${username}`
      );
      console.log(response.data.daysSinceJoining);
      return response.data.daysSinceJoining;
    } catch (error) {
      console.error("Error fetching user join days:", error);
      throw error;
    }
  };

  const handleAddReview = async () => {
    try {
      console.log("Adding review:", newReview); // 새로운 리뷰 상태 확인

      if (newReview.name && newReview.comment) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/review`,
          newReview
        );
        console.log("Review added successfully:", response);

        setReviews([
          ...reviews,
          {
            id: currentDetailId,
            name: newReview.name,
            comment: newReview.comment,
          },
        ]);
        setNewReview({ id: currentDetailId, name: user, comment: "" });
      } else {
        toast.warn("댓글 내용을 작성해주세요!");
      }
    } catch (error) {
      console.error("There was an error saving the review", error);
    }
  };

  const handleDepartPlace = () => {
    dispatch(
      isDepart(searchDetailInfo?.basicInfo?.placenamefull ?? searchDetailInfo)
    );
    dispatch(setSearchRouteMode(true));
    dispatch(setCurrentDepartPlaceX(currentTargetPlaceX!));
    dispatch(setCurrentDepartPlaceY(currentTargetPlaceY!));
    navigate(`/detail/mobility`);
  };

  const handleArrivePlace = () => {
    dispatch(
      isArrive(searchDetailInfo?.basicInfo?.placenamefull ?? searchDetailInfo)
    );
    dispatch(setSearchRouteMode(true));
    dispatch(setCurrentArrivePlaceX(currentTargetPlaceX!));
    dispatch(setCurrentArrivePlaceY(currentTargetPlaceY!));
    navigate(`/detail/mobility`);
  };

  return (
    <div
      className="p-4 overflow-y-auto bg-white w-80 relative z-50"
      style={{ flexShrink: 0 }}
    >
      <button
        onClick={closeDetail}
        className="absolute top-2 right-2 z-50 pl-1 pr-1 bg-white text-gray-700 text-xl font-bold w-auto h-auto"
      >
        X
      </button>
      <div
        className="flex items-center justify-center h-48 bg-gray-200 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage:
            searchDetailInfo &&
            searchDetailInfo.photo &&
            searchDetailInfo.photo.photoList[0] &&
            searchDetailInfo.photo.photoList[0].list[0]
              ? `url(${searchDetailInfo.photo.photoList[0].list[0].orgurl})`
              : `url(https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/default.png)`,
        }}
      ></div>
      <div className="text-left my-2 text-lg font-bold">
        {searchDetailInfo?.basicInfo?.placenamefull ?? searchDetailInfo}
      </div>
      <div className="flex my-4 justify-end ">
        <button
          className="relative flex mr-2 items-center hover:bg-gray-200 border bg-white p-2 shadow rounded-lg cursor-pointer"
          onClick={handleDepartPlace}
        >
          출발
        </button>
        <button
          className="relative flex items-center hover:bg-gray-200 border bg-white p-2 shadow rounded-lg cursor-pointer"
          onClick={handleArrivePlace}
        >
          도착
        </button>
      </div>
      {searchDetailInfo?.basicInfo?.placenamefull && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">후기</h2>
          <div className="space-y-4 mb-4 mt-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-700">후기를 작성해주세요!</p>
              </div>
            )}
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">후기 작성</h2>
            <div className="space-y-2">
              <textarea
                name="comment"
                placeholder="후기"
                value={newReview.comment}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() =>
                  token
                    ? handleAddReview()
                    : toast.warn("로그인 후 이용 가능합니다.")
                }
                className="w-full relative flex justify-center items-center hover:bg-gray-200 border bg-white p-2 shadow rounded-lg cursor-pointer"
              >
                후기 추가
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Detail;
