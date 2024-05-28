import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // 사용자 정보를 저장
  isLoggedIn: true, // 로그인 상태
  token: null, // 인증 토큰
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
