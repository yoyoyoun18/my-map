import axios from "axios";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookmark,
  removeBookmark,
} from "../features/bookmarks/bookmarksSlice";
import { setSearchWord } from "../features/search/searchSlice";

function BookMark() {
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkAddress, setBookmarkAddress] = useState("");
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const searchWord = useSelector((state) => state.search.searchWord);

  const handleSearchWord = (bookmarkWord) => {
    dispatch(setSearchWord(bookmarkWord));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const bookmarkData = {
      bookmark_name: bookmarkName,
      bookmark_address: bookmarkAddress,
    };

    axios
      .post("http://localhost:8080/bookmark", bookmarkData)
      .then((response) => {
        dispatch(addBookmark(bookmarkData));
        setBookmarkName(""); // 폼 필드 초기화
        setBookmarkAddress(""); // 폼 필드 초기화
        handleModal();
      })
      .catch((error) => {
        console.error("There was an error saving the bookmark", error);
      });
  };

  const handleDelete = (bookmarkId) => {
    fetch(`http://localhost:8080/bookmarks/${bookmarkId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the bookmark");
        }
        return response.json(); // 서버로부터의 응답을 JSON 형식으로 파싱
      })
      .then((data) => {
        console.log("Bookmark deleted successfully:", data);
        const element = document.getElementById(`bookmark-${bookmarkId}`);
      })
      .catch((error) => {
        console.error("Error deleting bookmark:", error);
      });
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="flex flex-col flex-wrap space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0 pb-4">
      {bookmarks.map((bookmark, index) => (
        <div
          key={index}
          id={`bookmark-${bookmark._id}`}
          className="relative flex items-center bg-white p-2 shadow rounded-lg cursor-pointer"
        >
          <div
            className="min-w-0"
            onClick={() => handleSearchWord(bookmark.bookmark_address)}
          >
            <h3 className="text-sm font-semibold truncate">
              {bookmark.bookmark_name}
            </h3>
          </div>
          <button
            onClick={() => handleDelete(bookmark._id)}
            className="absolute top-0 right-0 text-white bg-gray-700 hover:bg-gray-500 font-bold text-xs p-0.5 rounded-full"
            style={{
              width: "16px",
              height: "16px",
              transform: "translate(50%, -50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto h-full w-full p-4">
          <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-auto p-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                즐겨찾기 추가
              </h3>
              <div className="flex flex-col flex-wrap space-y-2 lg:flex-row lg:gap-2 lg:space-y-0 p-4">
                {bookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    id={`bookmark-${bookmark._id}`}
                    className="relative flex items-center bg-gray-200 p-2 rounded-lg shadow-md"
                    style={{ width: "auto", height: "auto" }}
                  >
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate text-gray-800">
                        {bookmark.bookmark_name}
                      </h3>
                    </div>
                    <button
                      onClick={() => dispatch(removeBookmark(bookmark._id))}
                      className="absolute top-0 right-0 text-white bg-gray-700 hover:bg-gray-500 font-bold text-xs p-0.5 rounded-full"
                      style={{
                        width: "16px",
                        height: "16px",
                        transform: "translate(50%, -50%)",
                        fontSize: "0.6rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  value={bookmarkName}
                  onChange={(e) => setBookmarkName(e.target.value)}
                  placeholder="북마크 저장명을 입력해주세요"
                  className="block w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  value={bookmarkAddress}
                  onChange={(e) => setBookmarkAddress(e.target.value)}
                  placeholder="주소를 입력해주세요"
                  className="block w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <div className="flex justify-center items-center space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={handleModal}
                    className="px-6 py-2 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookMark;
