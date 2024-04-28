import { createSlice } from "@reduxjs/toolkit";

export const lessonSlice = createSlice({
  name: "setUpLessons",
  initialState: {
    initLessons: {},
    initCustomizedLessons: {},
  },
  reducers: {
    getLessons: (state, action) => {
      state.initLessons = {
        lessonsData: action.payload,
      };
    },
    getCustomizedLessons: (state, action) => {
      state.initCustomizedLessons = {
        customizedLessonsData: action.payload,
      };
    },
  },
});
