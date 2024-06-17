import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arrive: null,
  depart: null,
  searchRouteMode: false,
  routeCount: 0,
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
    setRouteCount: (state, action) => {
      state.routeCount += 1;
    },
  },
});

export const { isArrive, isDepart, setSearchRouteMode, setRouteCount } =
  mobilitySlice.actions;
export default mobilitySlice.reducer;
