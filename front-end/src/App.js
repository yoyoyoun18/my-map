import React, { useEffect, useState } from "react";
import Detail from "./components/Detail";
import Header from "./components/Header";
import Map from "./components/Map";
import MyInfo from "./components/MyInfo";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResult";
import { useSelector } from "react-redux";
import BookMark from "./components/BookMark";
import axios from "axios";

function App() {
  // const bookmarks = [
  //   { name: "집", description: "신월5동 13-9" },
  //   { name: "직장", description: "서울 강남구 테헤란로14길 6" },
  //   { name: "부모님 집", description: "신월5동 13-9" },
  //   { name: "헬스장", description: "서울 강남구 테헤란로8길 7" },
  // ];

  const [bookmarks, setBookMarks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .then(() => {
        // always executed
      });
  }, []);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div className="flex flex-row h-screen">
      <div
        className="p-4 overflow-y-auto bg-gray-100 w-96 relative z-50"
        style={{ flexShrink: 0 }}
      >
        <Header />
        <SearchBar />
        {isLoggedIn && <MyInfo />}
        <BookMark bookmarks={bookmarks} />
        <SearchResults />
      </div>
      <Detail />
      <div className="flex-grow h-full">
        <Map />
      </div>
    </div>
  );
}

export default App;
