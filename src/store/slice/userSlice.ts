import { createSlice } from "@reduxjs/toolkit";
import { USER_INITIAL_STATE } from "../intialState";
import User from "@/types/types.user";

const userSlice = createSlice({
  name: "cart",
  initialState: USER_INITIAL_STATE,
  reducers: {
    updateUserDetails: (state: User, action) => {
      return { ...state };
    },
  },
});

export const { updateUserDetails } = userSlice.actions;
export default userSlice.reducer;
