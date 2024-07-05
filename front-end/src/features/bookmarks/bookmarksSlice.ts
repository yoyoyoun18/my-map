import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Bookmark {
  _id: string;
  // 다른 필요한 필드들 추가
}

interface BookmarksState {
  items: Bookmark[];
}

const initialState: BookmarksState = {
  items: [],
};

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.items.push(action.payload);
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (bookmark) => bookmark._id !== action.payload
      );
    },
    setBookmarks: (state, action: PayloadAction<Bookmark[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addBookmark, removeBookmark, setBookmarks } =
  bookmarksSlice.actions;

export default bookmarksSlice.reducer;
