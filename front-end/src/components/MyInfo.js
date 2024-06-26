import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmail, isName, isPicture } from "../features/auth/authSlice";

function MyInfo() {
  const myName = useSelector((state) => state.auth.user);
  const myEmail = useSelector((state) => state.auth.email);
  const myPicture = useSelector((state) => state.auth.picture);
  const dispatch = useDispatch();
  const userInfo = {
    image: myPicture, // 사용자 이미지 URL
    nickname: myName,
    email: myEmail,
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/myinfo`
        );
        const { existingUsers } = response.data;
        console.log(response.data);
        if (existingUsers.length > 0) {
          dispatch(isName(existingUsers[0].name));
          dispatch(isEmail(existingUsers[0].email));
          dispatch(isPicture(existingUsers[0].profileImageUrl));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserInfo();
  }, [dispatch, myName]);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg mb-4">
      {/* 사용자 이미지 */}
      <div
        className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-200"
        style={{
          backgroundImage: `url(${myPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* 사용자 정보 */}
      <div>
        <h2 className="text-lg font-semibold">{myName}</h2>
        <p>{myEmail}</p>
        <p>리뷰 수: </p>
        <p>좋아요 수:</p>
      </div>
    </div>
  );
}

export default MyInfo;
