import React, { useEffect } from "react";
import Detail from "./components/Detail";
import Header from "./components/Header";
import Map from "./components/Map";
import MyInfo from "./components/MyInfo";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import BookMark from "./components/BookMark";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBookmarks } from "./features/bookmarks/bookmarksSlice";
import { isToken } from "./features/auth/authSlice";
import Login from "./components/Login";
import { setSearchRouteMode } from "./features/mobility/mobilitySlice";
import Mobility from "./components/Mobility";

function App() {
  const dispatch = useDispatch();

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
        const response = await axios.get(
          "http://mymapapps.com/check-auth",
          {
            withCredentials: true,
          }
        );
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
        <Route path="/*" element={<MainComponent />} />
      </Routes>
    </Router>
  );
}

function MainComponent() {
  const token = useSelector((state) => state.auth.token);
  const detailPageState = useSelector((state) => state.search.detailPageState);
  const searchRouteMode = useSelector(
    (state) => state.mobility.searchRouteMode
  );
  const location = useLocation();

  return (
    <div className="flex flex-row h-screen font-sans">
      <div
        className="overflow-y-auto bg-gray-100 w-96 relative z-50"
        style={{ flexShrink: 0 }}
      >
        <div className="p-4 sticky top-0 left-0 w-full bg-gray-100">
          <Header />
          <SearchBar />
          {token && <MyInfo />}
          {token && <BookMark />}
        </div>
        <div className="p-4">
          <SearchResult />
        </div>
      </div>
      {detailPageState && location.pathname.startsWith("/detail") && <Detail />}
      {searchRouteMode &&
        (location.pathname.startsWith("/detail/mobility") ||
          location.pathname.startsWith("/detail")) && <Mobility />}
      <div className="flex-grow h-full">
        <Map />
      </div>
    </div>
  );
}

export default App;
