import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "../features/search/searchSlice";
import authSlice from "../features/auth/authSlice";
import bookmarksSlice from "../features/bookmarks/bookmarksSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
    auth: authSlice,
    bookmarks: bookmarksSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});
