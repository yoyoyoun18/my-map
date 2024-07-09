import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import {
  setSearchWord,
  incrementSearchCount,
} from "../features/search/searchSlice";

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const sanitizedInput = DOMPurify.sanitize(inputValue);
      dispatch(setSearchWord(sanitizedInput));
      dispatch(incrementSearchCount());
      event.preventDefault();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
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
};

export default SearchBar;
