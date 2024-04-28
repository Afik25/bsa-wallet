import { createSlice } from "@reduxjs/toolkit";

export const exerciseSlice = createSlice({
  name: "setUpExercises",
  initialState: {
    initExercises: {},
    initCustomizedExercises: {},
  },
  reducers: {
    getExercises: (state, action) => {
      state.initExercises = {
        ExercisesData: action.payload,
      };
    },
    getCustomizedExercises: (state, action) => {
      state.initCustomizedExercises = {
        customizedExercisesData: action.payload,
      };
    },
  },
});
