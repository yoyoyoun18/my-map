import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MobilityState } from "../../types";

const initialState: MobilityState = {
  arrive: null,
  depart: null,
  searchRouteMode: false,
  routeCount: 0,
};

const mobilitySlice = createSlice({
  name: "mobility",
  initialState,
  reducers: {
    isArrive: (state, action: PayloadAction<string | null>) => {
      state.arrive = action.payload;
    },
    isDepart: (state, action: PayloadAction<string | null>) => {
      state.depart = action.payload;
    },
    setSearchRouteMode: (state, action: PayloadAction<boolean>) => {
      state.searchRouteMode = action.payload;
    },
    setRouteCount: (state) => {
      state.routeCount += 1;
    },
  },
});

export const { isArrive, isDepart, setSearchRouteMode, setRouteCount } =
  mobilitySlice.actions;
export default mobilitySlice.reducer;
