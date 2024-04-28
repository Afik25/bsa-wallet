import { createSlice } from "@reduxjs/toolkit";

export const configurationSlice = createSlice({
  name: "setUp",
  initialState: {
    initConnectedUser: {},
  },
  reducers: {
    initConnectedUser: (state, action) => {
      state.initConnectedUser = {
        connectedUserData: action.payload,
      };
    },
  },
});
