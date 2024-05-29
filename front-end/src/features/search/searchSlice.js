import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchWord: "",
    searchCount: 0,
    searchResult: [],
  },
  reducers: {
    setSearchWord: (state, action) => {
      state.searchWord = action.payload;
    },
    resetSearchCount: (state) => {
      state.searchCount = 0;
    },
    incrementSearchCount: (state) => {
      state.searchCount += 1;
    },
    setSearchResult: (state, action) => {
      state.searchResult = action.payload;
    },
  },
});

export const {
  setSearchWord,
  resetSearchCount,
  incrementSearchCount,
  setSearchResult,
  setIsAddressTrue,
  setIsAddressFalse,
} = searchSlice.actions;

export default searchSlice.reducer;
