import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "../features/search/searchSlice";
import authSlice from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});
