import React from "react";

function BookMark({ bookmarks }) {
  return (
    <div className="flex flex-col flex-wrap space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
      {bookmarks.map((bookmark, index) => (
        <div
          key={index}
          className="flex items-center bg-white p-2 shadow rounded-lg "
          style={{ width: "auto", height: "auto" }}
        >
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{bookmark.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookMark;
