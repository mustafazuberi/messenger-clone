import { createSlice } from "@reduxjs/toolkit";

const initialState = "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    ToggleTheme: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { ToggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
