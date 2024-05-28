import React from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function fetchPlaceDetails(id) {
  return axios
    .get(`https://dapi.kakao.com/v2/local/search/place.json?place_id=${id}`, {
      headers: {
        Authorization: `KakaoAK {YOUR_KAKAO_API_KEY}`,
      },
    })
    .then((response) => response.data.documents[0]);
}

function SearchResults() {
  const searchResult = useSelector((state) => state.search.searchResult);
  const queryClient = useQueryClient();

  const handlePlaceClick = (id) => {
    // Trigger a query to fetch place details
    queryClient.fetchQuery(["placeDetails", id], () => fetchPlaceDetails(id), {
      staleTime: Infinity, // Optionally, specify that this data never goes stale
    });
  };

  return (
    <div className="space-y-2">
      {searchResult.map((result, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-lg shadow-lg space-y-2 cursor-pointer"
          onClick={() => handlePlaceClick(result.id)}
        >
          <h4 className="font-semibold text-lg text-blue-800">
            {result.place_name}
          </h4>
          <p className="text-gray-600">주소: {result.address_name}</p>
          <p className="text-gray-600">전화번호: {result.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
