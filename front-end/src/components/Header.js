import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <div className="flex justify-between items-center bg-gray-100 m-4">
      <h1 className="text-2xl font-semibold">My Map</h1>
      <div className="cursor-pointer text-2xl">
        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
      </div>
    </div>
  );
}

export default Header;
