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
import { useSelector } from "react-redux";

function App() {
  const [bookmarks, setBookMarks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/list")
      .then((response) => {
        setBookMarks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBookMarks([]);
      });
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
                <BookMark bookmarks={bookmarks} />
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
