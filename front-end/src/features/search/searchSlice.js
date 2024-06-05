import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchWord: "",
    searchCount: 0,
    searchResult: [],
    searchDetailInfo: {},
    detailPageState: false,
    currentDetailId: "",
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
    setSearchDetailInfo: (state, action) => {
      state.searchDetailInfo = action.payload; // searchDetailInfo를 업데이트하는 리듀서
    },
    isDetail: (state, action) => {
      state.detailPageState = action.payload;
    },
    setCurrentDetailId: (state, action) => {
      state.currentDetailId = action.payload;
    },
  },
});

export const {
  setSearchWord,
  resetSearchCount,
  incrementSearchCount,
  setSearchResult,
  setSearchDetailInfo,
  isDetail,
  setCurrentDetailId,
} = searchSlice.actions;

export default searchSlice.reducer;
