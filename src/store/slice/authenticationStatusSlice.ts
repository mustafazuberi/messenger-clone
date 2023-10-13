import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const authenticationStatusSlice = createSlice({
  name: "authenticationStatus",
  initialState,
  reducers: {
    setAuthenticationStatus: (state, action: PayloadAction<boolean>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setAuthenticationStatus } = authenticationStatusSlice.actions;
export default authenticationStatusSlice.reducer;
