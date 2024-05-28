import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchWord: "",
    searchCount: 0,
  },
  reducers: {
    setSearchWord: (state, action) => {
      state.searchWord = action.payload;
    },
    resetSearchCount: (state) => {
      state.searchCount = 0; // 검색 횟수 리셋
    },
    incrementSearchCount: (state) => {
      state.searchCount += 1; // 검색 횟수 증가
    },
  },
});

export const { setSearchWord, resetSearchCount, incrementSearchCount } =
  searchSlice.actions;

export default searchSlice.reducer;
