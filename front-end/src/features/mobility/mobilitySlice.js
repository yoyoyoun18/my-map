import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arrive: null,
  depart: null,
};

const mobilitySlice = createSlice({
  name: mobility,
  initialState,
  reducers: {
    isArrive: (state, action) => {},
    isDepart: (state, action) => {},
  },
});

export const { isArrive, isDepart } = mobilitySlice.actions;
export default mobilitySlice.reducer;
