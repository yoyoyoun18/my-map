import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // 사용자 정보를 저장
  email: null,
  isLoggedIn: true, // 로그인 상태
  token: false, // 인증 토큰
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.email = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    isToken: (state, action) => {
      state.token = action.payload.token;
    },
    isName: (state, action) => {
      state.user = action.payload;
    },
    isEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { login, logout, isToken, isName, isEmail } = authSlice.actions;
export default authSlice.reducer;
