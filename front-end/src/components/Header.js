import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { isToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Header() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginOut = async () => {
    if (token) {
      try {
        await axios.post(
          "http://mymapapps.com/logout",
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
        window.location.href = "http://mymapapps.com/login";
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  const refreshHandler = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 m-4 ">
      <h1
        className="text-6xl font-semibold font-bebas cursor-pointer"
        onClick={() => {
          refreshHandler();
        }}
      >
        MyMap
      </h1>
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
