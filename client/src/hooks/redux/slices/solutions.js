import { createSlice } from "@reduxjs/toolkit";

export const solutionSlice = createSlice({
  name: "setUpSolutions",
  initialState: {
    initSolutions: {},
    initCustomizedSolutions: {},
  },
  reducers: {
    getSolutions: (state, action) => {
      state.initSolutions = {
        SolutionsData: action.payload,
      };
    },
    getCustomizedSolutions: (state, action) => {
      state.initCustomizedSolutions = {
        customizedSolutionsData: action.payload,
      };
    },
  },
});
