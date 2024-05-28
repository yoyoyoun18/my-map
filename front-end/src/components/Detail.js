import React from "react";

function Detail() {
  return (
    <div
      className="p-4 overflow-y-auto bg-white w-80 relative z-50"
      style={{ flexShrink: 0 }}
    >
      {/* 이미지 표시 영역 */}
      <div className="flex items-center justify-center h-48 bg-gray-200">
        <p className="text-gray-500">장소 이미지</p>
      </div>

      {/* 출발/도착 버튼 */}
      <div className="flex my-4 justify-end ">
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 mr-2">
          출발
        </button>
        <button className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
          도착
        </button>
      </div>

      {/* 영업시간 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">영업시간</h2>
        <p>월-금: 9:00 - 21:00</p>
        <p>토-일: 10:00 - 22:00</p>
      </div>

      {/* 위치 정보 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">위치</h2>
        <p>서울특별시 강남구 어딘가 123번지</p>
      </div>

      {/* 메뉴 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">메뉴</h2>
        <p>커피: 5,000원</p>
        <p>티: 4,500원</p>
      </div>

      {/* 후기 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">후기</h2>
        <p>"정말 좋아요!" - 홍길동</p>
        <p>"분위기가 아늑해요." - 김철수</p>
      </div>
    </div>
  );
}

export default Detail;
