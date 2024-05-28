import React from "react";

function SearchBar() {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="장소 검색..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

export default SearchBar;
