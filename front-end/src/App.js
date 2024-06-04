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
import { isToken, isName, isEmail } from "./features/auth/authSlice";
import Login from "./components/Login";

function App() {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const token = useSelector((state) => state.auth.token);

  // useEffect(() => {
  //   // 전역 변수에 저장된 유저 정보 가져오기
  //   const user = window.__USER__;
  //   console.log(user);
  //   if (user) {
  //     // Redux 상태 업데이트
  //     dispatch(isName(user.name));
  //     dispatch(isEmail(user.email));
  //     dispatch(isToken({ token: true })); // 유저가 로그인 상태임을 표시
  //   }
  // }, [dispatch]);

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
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8080/check-auth", {
          withCredentials: true,
        });
        dispatch(isToken({ token: response.data.authenticated }));
      } catch (error) {
        dispatch(isToken({ token: false }));
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
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
                {token && <MyInfo />}
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
