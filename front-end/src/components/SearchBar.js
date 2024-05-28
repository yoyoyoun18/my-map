import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchWord } from "../features/search/searchSlice";

function SearchBar() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(""); // 입력 값을 로컬 상태로 관리합니다.

  // 엔터 키를 감지하여 상태를 업데이트하는 함수
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      dispatch(setSearchWord(inputValue)); // 엔터 키를 눌렀을 때만 Redux 스토어의 상태를 업데이트합니다.
      event.preventDefault(); // 엔터 키의 기본 이벤트를 방지합니다.
    }
  };

  // 입력 필드 값 변경 핸들러
  const handleChange = (event) => {
    setInputValue(event.target.value); // 입력 필드의 값이 변경될 때마다 로컬 상태를 업데이트합니다.
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="장소 검색..."
        className="w-full p-2 border border-gray-300 rounded-md"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;
