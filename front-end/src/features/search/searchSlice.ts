import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchState, SearchResult } from "../../types";

const initialState: SearchState = {
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
  isAddress: false,
  routeCount: 0,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchWord: (state, action: PayloadAction<string>) => {
      state.searchWord = action.payload;
    },
    resetSearchCount: (state) => {
      state.searchCount = 0;
    },
    incrementSearchCount: (state) => {
      state.searchCount += 1;
    },
    setSearchResult: (state, action: PayloadAction<SearchResult[]>) => {
      state.searchResult = action.payload;
    },
    setSearchDetailInfo: (state, action: PayloadAction<any>) => {
      state.searchDetailInfo = action.payload;
    },
    isDetail: (state, action: PayloadAction<boolean>) => {
      state.detailPageState = action.payload;
    },
    setCurrentDetailId: (state, action: PayloadAction<string>) => {
      state.currentDetailId = action.payload;
    },
    setCurrentTargetPlaceX: (state, action: PayloadAction<number | null>) => {
      state.currentTargetPlaceX = action.payload;
    },
    setCurrentTargetPlaceY: (state, action: PayloadAction<number | null>) => {
      state.currentTargetPlaceY = action.payload;
    },
    setCurrentDepartPlaceX: (state, action: PayloadAction<number | null>) => {
      state.currentDepartPlaceX = action.payload;
    },
    setCurrentDepartPlaceY: (state, action: PayloadAction<number | null>) => {
      state.currentDepartPlaceY = action.payload;
    },
    setCurrentArrivePlaceX: (state, action: PayloadAction<number | null>) => {
      state.currentArrivePlaceX = action.payload;
    },
    setCurrentArrivePlaceY: (state, action: PayloadAction<number | null>) => {
      state.currentArrivePlaceY = action.payload;
    },
    setIsAddressTrue: (state) => {
      state.isAddress = true;
    },
    setIsAddressFalse: (state) => {
      state.isAddress = false;
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
  setIsAddressTrue,
  setIsAddressFalse,
} = searchSlice.actions;

export default searchSlice.reducer;
