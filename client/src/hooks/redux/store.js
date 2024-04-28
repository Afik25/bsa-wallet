import { configureStore } from "@reduxjs/toolkit";
import { configurationSlice } from "./slices/configuration";
import { programSlice } from "./slices/programs";
import { levelSlice } from "./slices/levels";
import { courseSlice } from "./slices/courses";
import { lessonSlice } from "./slices/lessons";
import { exerciseSlice } from "./slices/exercises";
import { solutionSlice } from "./slices/solutions";

export const store = configureStore({
  reducer: {
    setInitConf: configurationSlice.reducer,
    setProgramSlice: programSlice.reducer,
    setLevelSlice: levelSlice.reducer,
    setCourseSlice: courseSlice.reducer,
    setLessonSlice: lessonSlice.reducer,
    setExerciseSlice: exerciseSlice.reducer,
    setSolutionSlice: solutionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
