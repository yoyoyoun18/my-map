import axios from "axios";
import React, { useState } from "react";

function BookMark({ bookmarks }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkAddress, setBookmarkAddress] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const bookmarkData = {
      bookmark_name: bookmarkName,
      bookmark_address: bookmarkAddress,
    };

    axios
      .post("http://localhost:8080/bookmark", bookmarkData)
      .then((response) => {
        console.log("Bookmark saved successfully", response);
        // 성공적으로 데이터를 저장한 후 UI를 업데이트 하거나,
        // 사용자에게 알림 메시지를 표시할 수 있습니다.
      })
      .catch((error) => {
        console.error("There was an error saving the bookmark", error);
      });

    // 폼 필드 초기화
    setBookmarkName("");
    setBookmarkAddress("");
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="flex flex-col flex-wrap space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
      {bookmarks.map((bookmark, index) => (
        <div
          key={index}
          className="flex items-center bg-white p-2 shadow rounded-lg"
          style={{ width: "auto", height: "auto" }}
        >
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">
              {bookmark.bookmark_name}
            </h3>
          </div>
        </div>
      ))}
      <button
        className="flex items-center bg-white p-2 shadow rounded-lg"
        onClick={handleModal}
      >
        <div className="min-w-0">
          <h2 className="text-md font-semibold truncate">+</h2>
        </div>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                <h3>즐겨찾기 추가</h3>
              </h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={bookmarkName}
                    onChange={(e) => setBookmarkName(e.target.value)}
                    placeholder="북마크 저장명을 입력해주세요"
                    required
                  />
                  <input
                    type="text"
                    value={bookmarkAddress}
                    onChange={(e) => setBookmarkAddress(e.target.value)}
                    placeholder="주소를 입력해주세요"
                    required
                  />
                  <button type="submit">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookMark;
