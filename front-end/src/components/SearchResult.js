import React from "react";

function SearchResults() {
  return (
    <div className="space-y-2">
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="font-semibold">결과 1</h4>
        <p>상세 설명...</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="font-semibold">결과 2</h4>
        <p>상세 설명...</p>
      </div>
      {/* 더 많은 결과 항목을 추가할 수 있습니다 */}
    </div>
  );
}

export default SearchResults;
