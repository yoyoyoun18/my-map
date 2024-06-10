import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "../features/search/searchSlice";
import authSlice from "../features/auth/authSlice";
import bookmarksSlice from "../features/bookmarks/bookmarksSlice";
import mobilitySlice from "../features/mobility/mobilitySlice";
import routeReducer from "../features/route/routeSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
    auth: authSlice,
    bookmarks: bookmarksSlice,
    mobility: mobilitySlice,
    route: routeReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
