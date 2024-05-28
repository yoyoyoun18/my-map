import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});
