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
    currentTargetPlaceX: null,
    currentTargetPlaceY: null,
    currentDepartPlaceX: null,
    currentDepartPlaceY: null,
    currentArrivePlaceX: null,
    currentArrivePlaceY: null,
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
      state.searchDetailInfo = action.payload;
    },
    isDetail: (state, action) => {
      state.detailPageState = action.payload;
    },
    setCurrentDetailId: (state, action) => {
      state.currentDetailId = action.payload;
    },
    setCurrentTargetPlaceX: (state, action) => {
      state.currentTargetPlaceX = action.payload;
    },
    setCurrentTargetPlaceY: (state, action) => {
      state.currentTargetPlaceY = action.payload;
    },
    setCurrentDepartPlaceX: (state, action) => {
      state.currentDepartPlaceX = action.payload;
    },
    setCurrentDepartPlaceY: (state, action) => {
      state.currentDepartPlaceY = action.payload;
    },
    setCurrentArrivePlaceX: (state, action) => {
      state.currentArrivePlaceX = action.payload;
    },
    setCurrentArrivePlaceY: (state, action) => {
      state.currentArrivePlaceY = action.payload;
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
  setCurrentTargetPlaceX,
  setCurrentTargetPlaceY,
  setCurrentDepartPlaceX,
  setCurrentDepartPlaceY,
  setCurrentArrivePlaceX,
  setCurrentArrivePlaceY,
} = searchSlice.actions;

export default searchSlice.reducer;
