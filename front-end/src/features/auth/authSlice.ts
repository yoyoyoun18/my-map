import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types";

const initialState: AuthState = {
  user: null,
  email: null,
  isLoggedIn: true,
  token: false,
  picture: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.email = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = false;
      state.isLoggedIn = false;
    },
    isToken: (state, action: PayloadAction<{ token: boolean }>) => {
      state.token = action.payload.token;
    },
    isName: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    isEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    isPicture: (state, action: PayloadAction<string>) => {
      state.picture = action.payload;
    },
  },
});

export const { login, logout, isToken, isName, isEmail, isPicture } =
  authSlice.actions;
export default authSlice.reducer;
