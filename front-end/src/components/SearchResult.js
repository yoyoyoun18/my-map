import React from "react";
import { useSelector } from "react-redux";

function SearchResults() {
  const searchResult = useSelector((state) => state.search.searchResult);

  return (
    <div className="space-y-2">
      {searchResult.map((result, i) => {
        return (
          <div key={i} className="p-4 bg-white rounded-lg shadow-lg space-y-2">
            <h4 className="font-semibold text-lg text-blue-800">
              {result.place_name}
            </h4>
            <p className="text-gray-600">주소: {result.address_name}</p>
            <p className="text-gray-600">전화번호: {result.phone}</p>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResults;
