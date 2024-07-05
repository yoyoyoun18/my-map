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
import { RootState } from "./app/store";
import Mobility from "./components/Mobility";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/list`)
      .then((response) => {
        dispatch(setBookmarks(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(setBookmarks([]));
      });
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/check-auth`,
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
};

const MainComponent: React.FC = () => {
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
