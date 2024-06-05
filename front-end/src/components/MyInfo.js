import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmail, isName } from "../features/auth/authSlice";

function MyInfo() {
  const myName = useSelector((state) => state.auth.user);
  const myEmail = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  const userInfo = {
    image: "https://example.com/path-to-your-image.jpg", // 사용자 이미지 URL
    nickname: myName,
    email: myEmail,
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/myinfo`)
      .then((response) => {
        dispatch(isName(response.data[0].name));
        dispatch(isEmail(response.data[0].email));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch]);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg mb-4">
      {/* 사용자 이미지 */}
      <div
        className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-200"
        style={{
          // backgroundImage: `url(${userInfo.image})`,
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
