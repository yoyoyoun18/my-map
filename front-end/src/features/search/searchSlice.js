import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchWord: "",
  },
  reducers: {
    setSearchWord: (state, action) => {
      state.searchWord = action.payload;
    },
  },
});

export const { setSearchWord } = searchSlice.actions;

export default searchSlice.reducer;
