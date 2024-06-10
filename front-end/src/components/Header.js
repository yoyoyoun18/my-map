import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { isToken } from "../features/auth/authSlice";

function Header() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleLoginOut = async () => {
    if (token) {
      try {
        await axios.post(
          "http://localhost:8080/logout",
          {},
          { withCredentials: true }
        );
        dispatch(isToken({ token: false }));
        window.location.reload();
      } catch (error) {
        console.error("Logout failed", error);
      }
    } else {
      try {
        window.location.href = "http://localhost:8080/login";
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 m-4 p-4">
      <h1 className="text-2xl font-semibold">My Map</h1>
      <div className="cursor-pointer text-2xl" onClick={handleLoginOut}>
        {token ? (
          <div className="flex justify-center items-center flex-col font-bold">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <p className="text-xs">로그아웃</p>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col font-bold">
            <FontAwesomeIcon icon={faSignInAlt} />
            <p className="text-xs">로그인</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
