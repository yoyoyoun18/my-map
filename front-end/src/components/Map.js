import React from "react";

function Map() {
  const locations = ["서울", "부산", "대구", "인천", "광주"];

  const handleLocationClick = (location) => {
    console.log(`${location} 검색`);
    // 여기에 지도 API 검색 로직을 추가
  };

  return (
    <div className="relative h-full bg-gray-300">
      {/* 상단 버튼 리스트 */}
      <div className="absolute top-0 left-0 p-4">
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          {locations.map((location, index) => (
            <button
              key={index}
              className="relative z-50 w-24 h-10 px-3 py-2 font-bold text-blue-500 bg-transparent border border-blue-500 rounded cursor-pointer hover:bg-blue-500 hover:text-white"
              onClick={() => handleLocationClick(location)}
            >
              #{location}
            </button>
          ))}
        </div>
      </div>
      {/* 지도 표시 영역 */}
      <div className="absolute inset-x-0 top-0 bottom-0 pt-16">
        <p className="pt-48 text-xl text-center text-white">지도 표시 영역</p>
      </div>
    </div>
  );
}

export default Map;
