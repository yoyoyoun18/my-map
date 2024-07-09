import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { isToken } from "./features/auth/authSlice";
import { RootState } from "./app/store";
import Detail from "./components/Detail";
import Header from "./components/Header";
import Map from "./components/Map";
import MyInfo from "./components/MyInfo";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import BookMark from "./components/BookMark";
import Mobility from "./components/Mobility";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/check-auth`,
          {
            withCredentials: true, // HttpOnly 쿠키를 포함한 요청
          }
        );
        if (response.data.authenticated) {
          dispatch(isToken({ token: true }));
          // 필요한 경우 사용자 정보를 저장할 수 있습니다.
          // dispatch(setUser(response.data.user));
        } else {
          dispatch(isToken({ token: false }));
        }
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
};

const MainComponent = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const detailPageState = useSelector(
    (state: RootState) => state.search.detailPageState
  );
  const searchRouteMode = useSelector(
    (state: RootState) => state.mobility.searchRouteMode
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
};

export default App;
