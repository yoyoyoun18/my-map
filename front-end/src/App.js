import React, { useEffect, useState } from "react";
import Detail from "./components/Detail";
import Header from "./components/Header";
import Map from "./components/Map";
import MyInfo from "./components/MyInfo";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResult";
import { useSelector } from "react-redux";

function App() {
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
