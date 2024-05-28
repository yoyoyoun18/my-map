import React from "react";

function MyInfo() {
  // 가정: 사용자 정보가 이런 형태로 있다고 가정합니다.
  const userInfo = {
    image: "https://example.com/path-to-your-image.jpg", // 사용자 이미지 URL
    nickname: "사용자123",
    email: "user123@example.com",
    reviews: 20,
    likes: 150,
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg mb-4">
      {/* 사용자 이미지 */}
      <div
        className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-200"
        style={{
          backgroundImage: `url(${userInfo.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* 사용자 정보 */}
      <div>
        <h2 className="text-lg font-semibold">{userInfo.nickname}</h2>
        <p>{userInfo.email}</p>
        <p>리뷰 수: {userInfo.reviews}</p>
        <p>좋아요 수: {userInfo.likes}</p>
      </div>
    </div>
  );
}

export default MyInfo;
