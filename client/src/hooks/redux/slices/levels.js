import { createSlice } from "@reduxjs/toolkit";

export const levelSlice = createSlice({
  name: "setUpLevels",
  initialState: {
    initLevels: {},
    initCustomizedLevels: {},
  },
  reducers: {
    getLevels: (state, action) => {
      state.initLevels = {
        levelsData: action.payload,
      };
    },
    getCustomizedLevels: (state, action) => {
      state.initCustomizedLevels = {
        customizedLevelsData: action.payload,
      };
    },
  },
});
