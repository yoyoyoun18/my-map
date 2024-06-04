import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { isName, isEmail, isToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        { name, password },
        { withCredentials: true }
      );
      const { user } = response.data;

      // Redux 상태 업데이트
      dispatch(isName(user.name));
      dispatch(isEmail(user.email));
      dispatch(isToken({ token: true }));

      // 로그인 성공 시 리다이렉션
      window.location.href = "http://localhost:3000/";
    } catch (error) {
      console.error("로그인 실패:", error);
      // 오류 처리
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;
