import React, { useEffect, useState } from "react";
import Detail from "./components/Detail";
import Header from "./components/Header";
import Map from "./components/Map";
import MyInfo from "./components/MyInfo";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import BookMark from "./components/BookMark";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBookmarks } from "./features/bookmarks/bookmarksSlice";

function App() {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8080/list")
      .then((response) => {
        // 성공적으로 데이터를 받아오면 Redux 상태 업데이트
        dispatch(setBookmarks(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // 에러 발생 시 빈 배열로 Redux 상태 설정
        dispatch(setBookmarks([]));
      });
  }, [bookmarks]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8080/protected", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    console.log(user);
  }, []);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-row h-screen">
              <div
                className="p-4 overflow-y-auto bg-gray-100 w-96 relative z-50"
                style={{ flexShrink: 0 }}
              >
                <Header />
                <SearchBar />
                {isLoggedIn && <MyInfo />}
                {bookmarks.length > 0 && <BookMark />}
                <SearchResult />
              </div>
              <Detail />
              <div className="flex-grow h-full">
                <Map />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
