import { createSlice } from "@reduxjs/toolkit";

export const programSlice = createSlice({
  name: "setUpPrograms",
  initialState: {
    initPrograms: {},
    initCustomizedPrograms: {},
  },
  reducers: {
    getPrograms: (state, action) => {
      state.initPrograms = {
        programsData: action.payload,
      };
    },
    getCustomizedPrograms: (state, action) => {
      state.initCustomizedPrograms = {
        customizedProgramsData: action.payload,
      };
    },
  },
});
