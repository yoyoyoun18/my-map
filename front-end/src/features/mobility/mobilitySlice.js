import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arrive: null,
  depart: null,
  searchRouteMode: false,
};

const mobilitySlice = createSlice({
  name: "mobility",
  initialState,
  reducers: {
    isArrive: (state, action) => {
      state.arrive = action.payload;
    },
    isDepart: (state, action) => {
      state.depart = action.payload;
    },
    setSearchRouteMode: (state, action) => {
      state.searchRouteMode = action.payload;
    },
  },
});

export const { isArrive, isDepart, setSearchRouteMode } = mobilitySlice.actions;
export default mobilitySlice.reducer;
