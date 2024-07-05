import { createSlice } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "route",
  initialState: {
    route: null,
  },
  reducers: {
    setRoute: (state, action) => {
      state.route = action.payload;
    },
    clearRoute: (state) => {
      state.route = null;
    },
  },
});

export const { setRoute, clearRoute } = routeSlice.actions;

export default routeSlice.reducer;
