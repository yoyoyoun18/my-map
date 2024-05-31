import { createSlice } from "@reduxjs/toolkit";

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: {
    items: [],
  },
  reducers: {
    addBookmark: (state, action) => {
      state.items.push(action.payload);
    },
    removeBookmark: (state, action) => {
      state.items = state.items.filter(
        (bookmark) => bookmark._id !== action.payload._id
      );
    },
    setBookmarks: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addBookmark, removeBookmark, setBookmarks } =
  bookmarksSlice.actions;

export default bookmarksSlice.reducer;
